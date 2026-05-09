import { runMigrations } from './migrations/run-migrations.js';

const STORAGE_KEY = 'you-are-ok:data';
const BACKUP_KEY = 'you-are-ok:data:backup';

function baseShape(data) {
  return {
    meta: data.meta || {},
    profile: data.profile || {},
    entries: data.entries || {},
    exercises: data.exercises || {},
    settings: data.settings || {},
  };
}

function saveLastActivity(meta, entry, action) {
  return {
    ...meta,
    lastActivity: {
      entryId: entry?.id,
      entryType: entry?.type,
      action,
      occurredAt: new Date().toISOString(),
      summary: entry?.type,
    },
  };
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return baseShape({});
  try {
    const parsed = JSON.parse(raw);
    const migrated = runMigrations(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem(BACKUP_KEY, raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return baseShape(migrated);
  } catch (error) {
    console.error('Unable to read stored data', error);
    return baseShape({});
  }
}

function withMeta(data) {
  const now = new Date().toISOString();
  const meta = { ...data.meta };
  if (!meta.schemaVersion) meta.schemaVersion = '1.1.0';
  if (!meta.createdAt) meta.createdAt = now;
  meta.lastUpdatedAt = now;
  return { ...data, meta };
}

export function getLastActivity() {
  return loadData().meta.lastActivity || null;
}

export function saveData(data) {
  const next = withMeta(baseShape(data));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function listEntriesByType(type) { return Object.values(loadData().entries).filter((entry) => entry.type === type && entry.deleted !== true); }
export function getEntry(id) { return loadData().entries[id] || null; }

export function upsertEntry(entry) {
  const data = loadData();
  const now = new Date().toISOString();
  const existing = data.entries[entry.id];
  const persisted = { ...entry, type: entry.type, id: entry.id, createdAt: existing?.createdAt || entry.createdAt || now, updatedAt: now, deleted: false };
  data.entries[entry.id] = persisted;
  data.meta = saveLastActivity(data.meta || {}, persisted, existing ? 'updated' : 'created');
  return saveData(data).entries[entry.id];
}

export function markEntryDeleted(id) {
  const data = loadData();
  if (!data.entries[id]) return null;
  const now = new Date().toISOString();
  data.entries[id] = { ...data.entries[id], deleted: true, deletedAt: now, updatedAt: now };
  data.meta = saveLastActivity(data.meta || {}, data.entries[id], 'deleted');
  saveData(data);
  return data.entries[id];
}

export function createEntryStore(entryType) {
  return { list() { return listEntriesByType(entryType); }, get(id) { const entry = getEntry(id); if (!entry || entry.type !== entryType) return null; return entry; }, save(entry) { return upsertEntry({ ...entry, type: entryType }); }, remove(id) { const existing = getEntry(id); if (!existing || existing.type !== entryType) return null; return markEntryDeleted(id); } };
}
