import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'catastrophising_check_in';
const store = createEntryStore(ENTRY_TYPE);

const BASE_CHECK_INS = [
  { label: '15 minutes', minutes: 15 },
  { label: '1 hour', minutes: 60 },
  { label: '4 hours', minutes: 240 },
];

function toIso(date) {
  return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
}

function addMinutes(date, minutes) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function createScheduledCheckIns(createdAt) {
  const anchor = createdAt ? new Date(createdAt) : new Date();
  return BASE_CHECK_INS.map((item) => ({
    id: createLocalId(),
    label: item.label,
    promptAt: toIso(addMinutes(anchor, item.minutes)),
    category: 'scheduled',
    evidence: '',
  }));
}

function ensureCheckIns(existingCheckIns, createdAt) {
  if (Array.isArray(existingCheckIns) && existingCheckIns.length) {
    return existingCheckIns.map((checkIn) => ({
      id: checkIn.id || createLocalId(),
      label: checkIn.label || 'Check-in',
      promptAt: checkIn.promptAt ? toIso(checkIn.promptAt) : toIso(createdAt || new Date()),
      category: checkIn.category || 'scheduled',
      evidence: typeof checkIn.evidence === 'string' ? checkIn.evidence : '',
      recordedAt: checkIn.recordedAt,
    }));
  }

  return createScheduledCheckIns(createdAt);
}

function applyOutcomeDate(checkIns, outcomeDate) {
  const withoutOutcome = checkIns.filter((checkIn) => checkIn.category !== 'outcome');
  if (!outcomeDate) {
    return withoutOutcome;
  }

  const isoDate = toIso(outcomeDate);
  const existingOutcome = checkIns.find((checkIn) => checkIn.category === 'outcome');

  const outcomeCheckIn = existingOutcome
    ? { ...existingOutcome, promptAt: isoDate, label: 'Outcome date' }
    : {
        id: createLocalId(),
        label: 'Outcome date',
        promptAt: isoDate,
        category: 'outcome',
        evidence: '',
      };

  return [...withoutOutcome, outcomeCheckIn];
}

function sortCheckIns(checkIns) {
  return [...checkIns].sort((a, b) => new Date(a.promptAt) - new Date(b.promptAt));
}

export function createEntryFromForm(form, existingEntry = null) {
  const thought = form.thought.value.trim();
  if (!thought) {
    return null;
  }

  const context = form.context.value.trim();
  const outcomeDate = form.outcomeDate.value ? form.outcomeDate.value : null;
  const createdAt = existingEntry?.createdAt || new Date().toISOString();
  const preservedCheckIns = ensureCheckIns(existingEntry?.checkIns || [], createdAt);
  const checkIns = sortCheckIns(applyOutcomeDate(preservedCheckIns, outcomeDate));

  const entry = {
    id: existingEntry?.id || createLocalId(),
    type: ENTRY_TYPE,
    thought,
    createdAt,
    checkIns,
  };

  if (context) {
    entry.context = context;
  }

  if (outcomeDate) {
    entry.outcomeDate = outcomeDate;
  }

  return entry;
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

export function saveCheckInEvidence(entryId, checkInId, evidenceText) {
  const entry = loadEntry(entryId);
  if (!entry) return null;

  const cleanEvidence = evidenceText.trim();
  const updated = {
    ...entry,
    checkIns: entry.checkIns.map((checkIn) => {
      if (checkIn.id !== checkInId) return checkIn;
      return {
        ...checkIn,
        evidence: evidenceText.length ? cleanEvidence : '',
        recordedAt: new Date().toISOString(),
      };
    }),
  };

  return saveEntry(updated);
}
