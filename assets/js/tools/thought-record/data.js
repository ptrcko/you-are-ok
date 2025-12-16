import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'thought_record';
const store = createEntryStore(ENTRY_TYPE);

function readRequiredText(field) {
  const value = field.value.trim();
  return value.length ? value : null;
}

function readOptionalText(field) {
  return field.value.trim();
}

export function createEntry(form, existingId, createdAt) {
  const situation = readRequiredText(form.situation);
  const automaticThought = readRequiredText(form.automaticThought);

  if (!situation || !automaticThought) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    situation,
    automaticThought,
    createdAt,
  };

  const optionalFields = {
    feelings: readOptionalText(form.feelings),
    supportingEvidence: readOptionalText(form.supportingEvidence),
    contradictingEvidence: readOptionalText(form.contradictingEvidence),
    balancedResponse: readOptionalText(form.balancedResponse),
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
