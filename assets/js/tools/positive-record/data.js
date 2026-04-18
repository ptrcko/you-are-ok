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

export function createEntry({ todayAnswer, pastAnswer, pastDate }) {
  return {
    id: createLocalId(),
    type: ENTRY_TYPE,
    today_answer: todayAnswer,
    past_answer: pastAnswer,
    past_date: pastDate,
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
