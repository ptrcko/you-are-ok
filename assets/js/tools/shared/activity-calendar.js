import { loadData } from '../../storage.js';

const ENTRY_TYPE_DETAILS = {
  mood_survey: { label: 'Brief Mood Survey', path: '/tools/brief-mood-survey/' },
  thought_record: { label: 'Thought Record', path: '/tools/thought-record/' },
  catastrophising_check_in: { label: 'Catastrophising Check-In', path: '/tools/catastrophising-check-in/' },
  story: { label: 'Story', path: '/tools/story/' },
  distortion_identification: { label: 'Cognitive Distortion Identification', path: '/tools/cognitive-distortion-identification/' },
  distortion_log: { label: 'Cognitive Distortions Log', path: '/tools/cognitive-distortions/' },
  cost_benefit: { label: 'Cost–Benefit Analysis', path: '/tools/cost-benefit-analysis/' },
  daily_good_record: { label: 'Daily Goor Record', path: '/tools/positive-record/' },
  anxiety_profile: { label: 'Anxiety Profile', path: '/tools/anxiety-profile/' },
  exposure_log: { label: 'Exposure Log', path: '/tools/exposure-log/' },
  relapse_awareness: { label: 'Relapse Awareness Log', path: '/tools/relapse-awareness-log/' },
};

function dayKey(value) { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }

export function humanizeEntryType(type) {
  const known = ENTRY_TYPE_DETAILS[type]?.label;
  if (known) return known;
  return String(type || '').split('_').filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

function toolPathForType(type) {
  return ENTRY_TYPE_DETAILS[type]?.path || null;
}

export function getActivityByDay() {
  const entries = Object.values(loadData().entries).filter((entry) => !entry.deleted);
  return entries.reduce((acc, entry) => {
    const when = entry.updatedAt || entry.createdAt;
    if (!when) return acc;
    const key = dayKey(when);
    const day = acc.get(key) || { total: 0, types: {} };
    day.total += 1;
    day.types[entry.type] = (day.types[entry.type] || 0) + 1;
    acc.set(key, day);
    return acc;
  }, new Map());
}

export function renderGlobalCalendar(root) {
  if (!root) return;
  const days = getActivityByDay();
  const rows = Array.from(days.entries()).sort((a,b)=>a[0]<b[0]?1:-1).slice(0,42);
  if (!rows.length) { root.innerHTML = '<p>No recorded activity yet.</p>'; return; }

  const selectedDate = rows[0][0];
  const calendarButtons = rows.map(([date, val]) => `<button type="button" class="calendar-day${date === selectedDate ? ' is-active' : ''}" data-day="${date}"><span>${date}</span><strong>${val.total}</strong></button>`).join('');

  root.innerHTML = `<div class="calendar-grid" role="list">${calendarButtons}</div><div id="calendar-day-details" class="entry-card"></div>`;

  const detailsRoot = root.querySelector('#calendar-day-details');
  const renderDayDetails = (date) => {
    const details = days.get(date);
    if (!details) return;
    const items = Object.entries(details.types).map(([type, count]) => {
      const label = humanizeEntryType(type);
      const path = toolPathForType(type);
      const typeLabel = path ? `<a href="${path}">${label}</a>` : label;
      return `<li>${typeLabel}: ${count}</li>`;
    }).join('');
    detailsRoot.innerHTML = `<p class="entry-title">Daily activity for ${date}</p><ul>${items}</ul>`;
  };

  renderDayDetails(selectedDate);

  root.querySelectorAll('.calendar-day').forEach((button) => {
    button.addEventListener('click', () => {
      root.querySelectorAll('.calendar-day').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      renderDayDetails(button.dataset.day);
    });
  });
}
