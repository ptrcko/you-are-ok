import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'exposure_log';
const store = createEntryStore(ENTRY_TYPE);

function readText(field) {
  return field.value.trim();
}

function readPercent(field) {
  const value = field.value.trim();
  if (!value) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 100) {
    throw new Error('Intensity scores must be between 0 and 100.');
  }
  return number;
}

export function createEntry(form, existingId, createdAt) {
  const focus = readText(form.focus);
  const sessionDate = form.sessionDate.value;

  if (!focus || !sessionDate) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    focus,
    sessionDate,
    createdAt,
  };

  const optionalFields = {
    location: readText(form.location),
    plannedStep: readText(form.plannedStep),
    startLevel: null,
    peakLevel: null,
    sensations: readText(form.sensations),
    observations: readText(form.observations),
  };

  try {
    optionalFields.startLevel = readPercent(form.startLevel);
    optionalFields.peakLevel = readPercent(form.peakLevel);
  } catch (error) {
    throw error;
  }

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value || value === 0) {
      entry[key] = value;
    }
  });

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
