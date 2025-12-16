const STORAGE_KEY = 'you-are-ok:data';

function baseShape(data) {
  return {
    meta: data.meta || {},
    profile: data.profile || {},
    entries: data.entries || {},
    exercises: data.exercises || {},
    settings: data.settings || {},
  };
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return baseShape({});
  }

  try {
    const parsed = JSON.parse(raw);
    return baseShape(parsed);
  } catch (error) {
    console.error('Unable to read stored data', error);
    return baseShape({});
  }
}

function withMeta(data) {
  const now = new Date().toISOString();
  const meta = { ...data.meta };

  if (!meta.schemaVersion) {
    meta.schemaVersion = '1.0.0';
  }
  if (!meta.createdAt) {
    meta.createdAt = now;
  }

  meta.lastUpdatedAt = now;

  return { ...data, meta };
}

export function saveData(data) {
  const next = withMeta(baseShape(data));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function listEntriesByType(type) {
  const data = loadData();
  return Object.values(data.entries).filter((entry) => entry.type === type && entry.deleted !== true);
}

export function getEntry(id) {
  const data = loadData();
  if (!data.entries[id]) return null;
  return data.entries[id];
}

export function upsertEntry(entry) {
  const data = loadData();
  const now = new Date().toISOString();
  const existing = data.entries[entry.id];

  const persisted = {
    ...entry,
    type: entry.type,
    id: entry.id,
    createdAt: existing?.createdAt || entry.createdAt || now,
    updatedAt: now,
    deleted: false,
  };

  data.entries[entry.id] = persisted;
  return saveData(data).entries[entry.id];
}

export function markEntryDeleted(id) {
  const data = loadData();
  if (!data.entries[id]) {
    return null;
  }

  const now = new Date().toISOString();
  data.entries[id] = {
    ...data.entries[id],
    deleted: true,
    deletedAt: now,
    updatedAt: now,
  };

  saveData(data);
  return data.entries[id];
}
