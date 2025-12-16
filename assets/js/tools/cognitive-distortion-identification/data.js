import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';
import { getDistortionOptions } from '../cognitive-distortions/data.js';

const ENTRY_TYPE = 'distortion_identification';
const store = createEntryStore(ENTRY_TYPE);

function readText(field) {
  return field.value.trim();
}

function readSelectedDistortions(form) {
  const checked = Array.from(form.querySelectorAll('input[name="distortions"]:checked'));
  return checked.map((input) => input.value);
}

export function createEntry(form, existingId, createdAt) {
  const statement = readText(form.statement);
  const distortions = readSelectedDistortions(form);

  if (!statement || distortions.length === 0) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    statement,
    distortions,
    createdAt,
  };

  const reflections = readText(form.reflections);
  if (reflections) {
    entry.reflections = reflections;
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

export function loadOptions() {
  return getDistortionOptions();
}
