import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'relapse_awareness';
const store = createEntryStore(ENTRY_TYPE);

function readText(field) {
  return field.value.trim();
}

export function createEntry(form, existingId, createdAt) {
  const event = readText(form.eventDescription);
  const feelingsBefore = readText(form.feelingsBefore);

  if (!event || !feelingsBefore) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    event,
    feelingsBefore,
    createdAt,
  };

  const optionalFields = {
    feelingsAfter: readText(form.feelingsAfter),
    helpfulResponse: readText(form.helpfulResponse),
    reflections: readText(form.reflections),
    supportNeeded: readText(form.supportNeeded),
  };

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value) {
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
