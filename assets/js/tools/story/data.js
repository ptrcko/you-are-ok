import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'story';
const store = createEntryStore(ENTRY_TYPE);

function readText(field) {
  return field.value.trim();
}

export function createEntry(form, existingId, createdAt) {
  const format = form.entryFormat.value.trim();
  const body = readText(form.body);

  if (!format || !body) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    format,
    body,
    createdAt,
  };

  const title = readText(form.title);
  if (title) {
    entry.title = title;
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
