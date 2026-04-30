import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'daily_good_record';
const store = createEntryStore(ENTRY_TYPE);

const REFLECTIONS = [
  'Thanks. Over time, this helps build a clearer picture of your days.',
  'Not every day is the same, and looking back can sometimes shift perspective.',
  'Patterns become clearer when you check in regularly.',
];

function toMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function randomPastDate(referenceDate = new Date()) {
  const today = toMidnight(referenceDate);
  const daysBack = Math.floor(Math.random() * 90) + 1;
  const selected = new Date(today);
  selected.setDate(today.getDate() - daysBack);
  return selected;
}

export function formatLongDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function randomReflection() {
  return REFLECTIONS[Math.floor(Math.random() * REFLECTIONS.length)];
}

function toLocalIsoDay(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parsePastDate(pastDate) {
  if (pastDate instanceof Date) return pastDate;
  if (typeof pastDate === 'string') {
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(pastDate.trim());
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }
  return pastDate ? new Date(pastDate) : null;
}

export function createEntry({ todayAnswer, pastAnswer, pastDate }) {
  const parsedPastDate = parsePastDate(pastDate);
  const pastDateIso =
    parsedPastDate && !Number.isNaN(parsedPastDate.getTime()) ? toLocalIsoDay(parsedPastDate) : '';
  const todayIso = toLocalIsoDay(new Date());
  const entryType = pastDateIso && pastDateIso !== todayIso ? 'remembered' : 'same_day';
  return {
    id: createLocalId(),
    type: ENTRY_TYPE,
    today_answer: todayAnswer ?? null,
    past_answer: pastAnswer,
    past_date: pastDate,
    past_date_iso: pastDateIso,
    entry_type: entryType,
    analytics: {
      entry_type: entryType,
    },
    reflection: true,
  };
}

export function saveEntry(entry) {
  return store.save(entry);
}

export function deleteEntry(id) {
  return store.remove(id);
}

export function listEntries() {
  return store
    .list()
    .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
}
