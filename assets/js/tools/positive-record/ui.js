function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatAnswer(value) {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (value === 'i_dont_remember') return 'I don’t remember';
  return value;
}

function dayKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isRememberedLogDate(value) {
  const observed = new Date(value);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const observedDay = new Date(observed.getFullYear(), observed.getMonth(), observed.getDate());
  return observedDay.getTime() < today.getTime();
}

function isGoodDayEntry(entry) {
  return entry.answer === 'no';
}

function isTrackedAnswer(answer) {
  return answer === 'yes' || answer === 'no';
}

function parsePastDate(entry) {
  if (entry.past_date_iso) return new Date(`${entry.past_date_iso}T00:00:00`);
  if (!entry.past_date) return null;
  const parsed = new Date(entry.past_date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function toDailyObservations(entries) {
  const observations = [];
  entries.forEach((entry) => {
    const createdTimestamp = entry.createdAt || entry.updatedAt;
    if (createdTimestamp && isTrackedAnswer(entry.today_answer)) {
      observations.push({ answer: entry.today_answer, observedAt: createdTimestamp, isRememberedLog: false });
    }
    const pastDate = parsePastDate(entry);
    if (pastDate && isTrackedAnswer(entry.past_answer)) {
      observations.push({ answer: entry.past_answer, observedAt: pastDate.toISOString(), isRememberedLog: isRememberedLogDate(pastDate) });
    }
  });
  return observations;
}

function getLatestPerDay(entries) {
  const observations = toDailyObservations(entries);
  const map = new Map();
  observations.forEach((entry) => {
    const timestamp = entry.observedAt;
    if (!timestamp) return;
    const key = dayKey(timestamp);
    const existing = map.get(key);
    const entryTime = new Date(timestamp).getTime();
    const existingTime = existing ? new Date(existing.observedAt || 0).getTime() : -Infinity;
    if (!existing || entryTime >= existingTime) map.set(key, entry);
  });
  return Array.from(map.values()).sort((a, b) => new Date(a.observedAt || 0) - new Date(b.observedAt || 0));
}

function calculateGoodStreak(entries) {
  const uniqueByDay = getLatestPerDay(entries).sort((a, b) => new Date(b.observedAt || 0) - new Date(a.observedAt || 0));
  let streak = 0;
  for (const entry of uniqueByDay) {
    if (isGoodDayEntry(entry)) streak += 1;
    else break;
  }
  return streak;
}

export function createCalendarMarkup(entries, offsetBlocks = 0) {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() - offsetBlocks * 42);
  const start = new Date(end);
  start.setDate(end.getDate() - 41);

  const latestByDay = new Map(getLatestPerDay(entries).map((entry) => [dayKey(entry.observedAt), entry]));
  const unanswered = [];
  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = dayKey(date);
    const entry = latestByDay.get(key);

    let state = 'empty';
    let label = `${date.toLocaleDateString()}: no check-in`;
    if (entry) {
      state = isGoodDayEntry(entry) ? 'good' : 'tough';
      const rememberedText = entry.isRememberedLog ? ', remembered log' : '';
      label = `${date.toLocaleDateString()}: ${isGoodDayEntry(entry) ? 'good day' : 'tough day'}${rememberedText}`;
    } else if (isRememberedLogDate(date)) {
      unanswered.push({ key, date, label: date.toLocaleDateString() });
    }

    const rememberedClass = entry?.isRememberedLog ? ' remembered-log' : '';
    const selectable = !entry && isRememberedLogDate(date);
    const button = selectable
      ? `<button type="button" class="calendar-select" data-missed-date="${key}" aria-label="Select ${label}">${date.getDate()}</button>`
      : `${date.getDate()}`;

    cells.push(`<li class="calendar-cell ${state}${rememberedClass}" title="${label}" aria-label="${label}">${button}</li>`);
  }

  return {
    markup: `
      <div class="calendar-wrap">
        <div class="calendar-controls">
          <button type="button" class="secondary" data-calendar-nav="back">Previous 6 weeks</button>
          <button type="button" class="secondary" data-calendar-nav="forward" ${offsetBlocks === 0 ? 'disabled' : ''}>Next 6 weeks</button>
          <button type="button" class="secondary" data-calendar-reset ${offsetBlocks === 0 ? 'disabled' : ''}>Reset to current</button>
        </div>
        <p class="calendar-caption">${start.toLocaleDateString()} – ${end.toLocaleDateString()}</p>
        <ul class="calendar-grid" role="list">${cells.join('')}</ul>
        <p class="calendar-legend">
          <span><i class="legend-dot good"></i> Good day</span>
          <span><i class="legend-dot tough"></i> Tough day</span>
          <span><i class="legend-dot remembered"></i> Remembered log</span>
          <span><i class="legend-dot empty"></i> No check-in</span>
        </p>
      </div>
    `,
    unansweredByKey: new Map(unanswered.map((item) => [item.key, item.date])),
  };
}

export function getPageElements() {
  return {
    todayOptions: document.querySelector('#today-options'),
    pastSection: document.querySelector('#past-section'),
    pastQuestion: document.querySelector('#past-question'),
    pastDateNote: document.querySelector('#past-date-note'),
    pastOptions: document.querySelector('#past-options'),
    reflectionSection: document.querySelector('#reflection-section'),
    reviewDateEl: document.querySelector('#review-date'),
    reflectionText: document.querySelector('#reflection-text'),
    statusEl: document.querySelector('#form-status'),
    entriesContainer: document.querySelector('#entries'),
    vizPanels: document.querySelector('#viz-panels'),
  };
}

export function setPastQuestion(pastQuestionEl, dateText) { pastQuestionEl.textContent = `Thinking back to ${dateText}, did anything bad happen that day?`; }
export function renderReviewDate(reviewDateEl, dateText, isRemembered) { if (!reviewDateEl) return; if (!dateText) { reviewDateEl.textContent = ''; return; } reviewDateEl.innerHTML = isRemembered ? `Check-in date: <strong>${dateText}</strong> <span class="entry-type-tag">Remembered</span>` : `Check-in date: <strong>${dateText}</strong>`; }
export function setPastDateNote(noteEl, { dateText, isRememberedLog }) { if (!noteEl) return; noteEl.hidden = false; noteEl.className = `date-summary-chip${isRememberedLog ? ' remembered-log' : ''}`; noteEl.textContent = isRememberedLog ? `Remembered log · ${dateText}` : `Check-in date · ${dateText}`; }
export function setStatus(statusEl, message) { statusEl.textContent = message; }

export function renderVisualizations(panelsEl, entries, { offsetBlocks, onSelectDate, onNavigate, onResetView }) {
  if (!panelsEl) return;
  const streak = calculateGoodStreak(entries);
  const { markup, unansweredByKey } = createCalendarMarkup(entries, offsetBlocks);

  panelsEl.innerHTML = `
    <section class="viz-panel" data-panel="streak">
      <p class="streak-count">${streak}</p>
      <p class="streak-copy">Current good-day streak (today + past-day answers)</p>
      <p class="notice">A good day is when you answered “No” to either check-in question.</p>
    </section>
    <section class="viz-panel" data-panel="calendar">${markup}</section>
  `;

  panelsEl.querySelector('[data-calendar-nav="back"]')?.addEventListener('click', () => onNavigate(1));
  panelsEl.querySelector('[data-calendar-nav="forward"]')?.addEventListener('click', () => onNavigate(-1));
  panelsEl.querySelector('[data-calendar-reset]')?.addEventListener('click', onResetView);
  panelsEl.querySelectorAll('[data-missed-date]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.missedDate;
      const date = unansweredByKey.get(value);
      if (date) onSelectDate(date);
    });
  });
}

export function renderEntries(container, entries, { onDelete }) {
  container.innerHTML = '';
  if (!entries.length) { const empty = document.createElement('p'); empty.textContent = 'No check-ins saved yet.'; container.appendChild(empty); return; }
  const list = document.createElement('ul'); list.className = 'entry-list';
  entries.forEach((entry) => {
    const item = document.createElement('li'); item.className = 'entry-card';
    const header = document.createElement('div'); header.className = 'entry-header';
    const title = document.createElement('p'); title.className = 'entry-title'; title.textContent = `Recorded ${formatTimestamp(entry.createdAt || entry.updatedAt)}`;
    const deleteButton = document.createElement('button'); deleteButton.type = 'button'; deleteButton.className = 'secondary'; deleteButton.textContent = 'Delete'; deleteButton.addEventListener('click', () => onDelete(entry));
    header.append(title, deleteButton);
    const details = document.createElement('dl'); details.className = 'entry-details';
    const rows = [['Today', formatAnswer(entry.today_answer)], [entry.past_date ? `Past day (${entry.past_date})${isRememberedLogDate(entry.past_date_iso || entry.past_date) ? ' · Remembered log' : ''}` : 'Past day', formatAnswer(entry.past_answer)]];
    rows.forEach(([label, value]) => { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; details.append(dt, dd); });
    item.append(header, details); list.appendChild(item);
  });
  container.appendChild(list);
}
