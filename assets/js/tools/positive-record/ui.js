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
      observations.push({
        answer: entry.today_answer,
        observedAt: createdTimestamp,
        isRememberedLog: false,
      });
    }

    const pastDate = parsePastDate(entry);
    if (pastDate && isTrackedAnswer(entry.past_answer)) {
      observations.push({
        answer: entry.past_answer,
        observedAt: pastDate.toISOString(),
        isRememberedLog: isRememberedLogDate(pastDate),
      });
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
    if (!existing || entryTime >= existingTime) {
      map.set(key, entry);
    }
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.observedAt || 0) - new Date(b.observedAt || 0),
  );
}

function calculateGoodStreak(entries) {
  const uniqueByDay = getLatestPerDay(entries).sort(
    (a, b) => new Date(b.observedAt || 0) - new Date(a.observedAt || 0),
  );

  let streak = 0;
  for (const entry of uniqueByDay) {
    if (isGoodDayEntry(entry)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function createTrendSvg(entries) {
  const uniqueByDay = getLatestPerDay(entries);
  const width = 700;
  const height = 220;
  const padding = 24;

  if (uniqueByDay.length <= 1) {
    return '<p class="notice">Add at least two check-ins to draw the trend line.</p>';
  }

  let totalGood = 0;
  const points = uniqueByDay.map((entry, index) => {
    if (isGoodDayEntry(entry)) totalGood += 1;
    const ratio = totalGood / (index + 1);
    return { ratio, label: new Date(entry.observedAt || Date.now()).toLocaleDateString() };
  });

  const stepX = (width - padding * 2) / (points.length - 1);
  const coordinates = points.map((point, index) => {
    const x = padding + index * stepX;
    const y = height - padding - point.ratio * (height - padding * 2);
    return { ...point, x, y };
  });

  const polyline = coordinates.map((point) => `${point.x},${point.y}`).join(' ');
  const latest = points[points.length - 1];
  const latestPercent = Math.round(latest.ratio * 100);

  return `
    <div class="trend-chart" role="img" aria-label="Trend line of good-day percentage over time">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="chart-axis"></line>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" class="chart-axis"></line>
        <polyline points="${polyline}" class="chart-line"></polyline>
        ${coordinates
          .map(
            (point) =>
              `<circle cx="${point.x}" cy="${point.y}" r="4" class="chart-point"><title>${point.label}: ${Math.round(
                point.ratio * 100,
              )}% good-day rate</title></circle>`,
          )
          .join('')}
      </svg>
      <p class="chart-summary">Current good-day rate: <strong>${latestPercent}%</strong></p>
    </div>
  `;
}

export function createCalendarMarkup(entries) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 41);

  const latestByDay = new Map(
    getLatestPerDay(entries).map((entry) => [dayKey(entry.observedAt), entry]),
  );

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
    }

    const rememberedClass = entry?.isRememberedLog ? ' remembered-log' : '';
    const rememberedA11y = entry?.isRememberedLog
      ? '<span class="sr-only">Remembered log.</span>'
      : '';

    cells.push(
      `<li class="calendar-cell ${state}${rememberedClass}" title="${label}" aria-label="${label}">${date.getDate()}${rememberedA11y}</li>`,
    );
  }

  return `
    <div class="calendar-wrap">
      <p class="calendar-caption">Last 6 weeks</p>
      <ul class="calendar-grid" role="list">${cells.join('')}</ul>
      <p class="calendar-legend">
        <span><i class="legend-dot good"></i> Good day</span>
        <span><i class="legend-dot tough"></i> Tough day</span>
        <span><i class="legend-dot remembered"></i> Remembered log</span>
        <span><i class="legend-dot empty"></i> No check-in</span>
      </p>
    </div>
  `;
}

function renderSwitcher(panels, defaultKey = 'streak') {
  const { switcher, content } = panels;
  const buttons = Array.from(switcher.querySelectorAll('button[data-view]'));

  function setView(view) {
    buttons.forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });

    const views = Array.from(content.querySelectorAll('[data-panel]'));
    views.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== view;
    });

    switcher.dataset.activeView = view;
  }

  switcher.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-view]');
    if (!button) return;
    setView(button.dataset.view);
  });

  setView(switcher.dataset.activeView || defaultKey);
}

export function getPageElements() {
  return {
    todayOptions: document.querySelector('#today-options'),
    pastSection: document.querySelector('#past-section'),
    pastQuestion: document.querySelector('#past-question'),
    pastDateNote: document.querySelector('#past-date-note'),
    pastOptions: document.querySelector('#past-options'),
    reflectionSection: document.querySelector('#reflection-section'),
    reflectionText: document.querySelector('#reflection-text'),
    statusEl: document.querySelector('#form-status'),
    entriesContainer: document.querySelector('#entries'),
    vizSwitcher: document.querySelector('#viz-switcher'),
    vizPanels: document.querySelector('#viz-panels'),
  };
}

export function setPastQuestion(pastQuestionEl, dateText) {
  pastQuestionEl.textContent = `Thinking back to ${dateText}, did anything bad happen that day?`;
}

export function setPastDateNote(noteEl, { dateText, isRememberedLog }) {
  if (!noteEl) return;
  noteEl.hidden = false;
  noteEl.className = `date-summary-chip${isRememberedLog ? ' remembered-log' : ''}`;
  noteEl.textContent = isRememberedLog
    ? `Remembered log · ${dateText}`
    : `Check-in date · ${dateText}`;
}

export function setStatus(statusEl, message) {
  statusEl.textContent = message;
}

export function renderVisualizations(switcher, panelsEl, entries) {
  if (!switcher || !panelsEl) return;

  const streak = calculateGoodStreak(entries);
  const allObservations = toDailyObservations(entries).filter((entry) => isTrackedAnswer(entry.answer));
  const total = allObservations.length;
  const goodCount = allObservations.filter(isGoodDayEntry).length;
  const rate = total ? Math.round((goodCount / total) * 100) : 0;

  panelsEl.innerHTML = `
    <section class="viz-panel" data-panel="streak">
      <p class="streak-count">${streak}</p>
      <p class="streak-copy">Current good-day streak (today + past-day answers)</p>
      <p class="notice">A good day is when you answered “No” to either check-in question.</p>
    </section>
    <section class="viz-panel" data-panel="calendar" hidden>
      ${createCalendarMarkup(entries)}
    </section>
    <section class="viz-panel" data-panel="trend" hidden>
      ${createTrendSvg(entries)}
      <p class="notice">Overall good-day ratio across today and past-day answers: <strong>${rate}%</strong> (${goodCount}/${total || 0}).</p>
    </section>
  `;

  if (!switcher.dataset.bound) {
    renderSwitcher({ switcher, content: panelsEl });
    switcher.dataset.bound = 'true';
  }
}

export function renderEntries(container, entries, { onDelete }) {
  container.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No check-ins saved yet.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'entry-list';

  entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'entry-card';

    const header = document.createElement('div');
    header.className = 'entry-header';

    const title = document.createElement('p');
    title.className = 'entry-title';
    title.textContent = `Recorded ${formatTimestamp(entry.createdAt || entry.updatedAt)}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => onDelete(entry));

    header.append(title, deleteButton);

    const details = document.createElement('dl');
    details.className = 'entry-details';

    const rows = [
      ['Today', formatAnswer(entry.today_answer)],
      [
        entry.past_date
          ? `Past day (${entry.past_date})${isRememberedLogDate(entry.past_date_iso || entry.past_date) ? ' · Remembered log' : ''}`
          : 'Past day',
        formatAnswer(entry.past_answer),
      ],
    ];

    rows.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      details.append(dt, dd);
    });

    item.append(header, details);
    list.appendChild(item);
  });

  container.appendChild(list);
}
