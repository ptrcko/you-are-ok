import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'cost_benefit';
const store = createEntryStore(ENTRY_TYPE);

function readFocus(form) {
  const value = form.focus.value.trim();
  return value.length ? value : null;
}

function readNotes(form) {
  const value = form.notes.value.trim();
  return value.length ? value : '';
}

function normalizeItems(items) {
  return items
    .map((item) => ({ id: item.id || createLocalId(), text: (item.text || '').trim() }))
    .filter((item) => item.text.length > 0);
}

function buildEntry(form, advantages, disadvantages, existingId, createdAt) {
  const focus = readFocus(form);
  const cleanAdvantages = normalizeItems(advantages);
  const cleanDisadvantages = normalizeItems(disadvantages);

  if (!focus || (cleanAdvantages.length === 0 && cleanDisadvantages.length === 0)) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    focus,
    advantages: cleanAdvantages,
    disadvantages: cleanDisadvantages,
    createdAt,
  };

  const notes = readNotes(form);
  if (notes) {
    entry.notes = notes;
  }

  return entry;
}

export const createEntry = {
  addItem(existing, text) {
    const trimmed = text.trim();
    if (!trimmed) return existing;
    const next = existing.map((item) => ({ ...item }));
    next.push({ id: createLocalId(), text: trimmed });
    return next;
  },
  fromForm(form, advantages, disadvantages, existingId, createdAt) {
    return buildEntry(form, advantages, disadvantages, existingId, createdAt);
  },
};

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
