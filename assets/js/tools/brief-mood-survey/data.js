import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'mood_survey';
const store = createEntryStore(ENTRY_TYPE);

// Parse a comma-delimited string into numeric scores constrained to 0–4.
export function parseScoresInput(value) {
  if (!value.trim()) return null;

  const parts = value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  const numbers = parts.map((part) => Number(part));
  const invalid = numbers.some((num) => Number.isNaN(num) || num < 0 || num > 4);
  if (invalid || numbers.length === 0) {
    return null;
  }
  return numbers;
}

export function buildScoresFromForm(form) {
  const anxietyFeelings = parseScoresInput(form.anxietyFeelings.value);
  const anxietyPhysical = parseScoresInput(form.anxietyPhysical.value);
  const depression = parseScoresInput(form.depression.value);
  const suicidalUrges = parseScoresInput(form.suicidalUrges.value);

  if (!anxietyFeelings || !anxietyPhysical || !depression || !suicidalUrges) {
    return null;
  }

  return {
    anxiety_feelings: anxietyFeelings,
    anxiety_physical: anxietyPhysical,
    depression,
    suicidal_urges: suicidalUrges,
  };
}

export function totalsFromScores(scores) {
  return {
    anxiety_feelings: scores.anxiety_feelings.reduce((sum, value) => sum + value, 0),
    anxiety_physical: scores.anxiety_physical.reduce((sum, value) => sum + value, 0),
    depression: scores.depression.reduce((sum, value) => sum + value, 0),
    suicidal_urges: scores.suicidal_urges.reduce((sum, value) => sum + value, 0),
  };
}

export function createEntry(scores, existingId, createdAt) {
  return {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    scores,
    totals: totalsFromScores(scores),
    createdAt,
  };
}

export function listEntries() {
  return store
    .list()
    .filter((entry) => entry.type === ENTRY_TYPE)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveEntry(entry) {
  return store.save(entry);
}

export function deleteEntry(id) {
  return store.remove(id);
}

export function loadEntry(id) {
  return store.get(id);
}
