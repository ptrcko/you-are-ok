import { createLocalId } from '../shared/ids.js';

const STORAGE_KEY = 'phobia-log-entries';

function formatTimestamp(value) {
  if (!value) return 'Saved time not recorded';
  const date = new Date(value);
  return `Saved ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function getEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Unable to read stored phobia logs', error);
    return [];
  }
}

function persistEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatPercent(value) {
  if (value === '' || value === null || value === undefined) return '';
  return `${value}%`;
}

function renderEntries(container, entries, callbacks) {
  container.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No sessions saved on this device yet.';
    container.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'saved-card';

    const header = document.createElement('div');
    header.className = 'saved-card__header';

    const title = document.createElement('h3');
    title.textContent = entry.exposureType || 'Exposure session';
    header.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'saved-card__actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => callbacks.onEdit(entry));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'secondary';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => callbacks.onDelete(entry));

    actions.append(editBtn, deleteBtn);
    header.appendChild(actions);

    const meta = document.createElement('p');
    const date = entry.sessionDate ? new Date(entry.sessionDate).toLocaleDateString() : 'No date set';
    meta.textContent = `${date} · ${entry.timeSpent || 'No duration noted'}`;

    const savedAt = document.createElement('p');
    savedAt.className = 'hint';
    savedAt.textContent = formatTimestamp(entry.savedAt);

    const anxiety = document.createElement('p');
    anxiety.textContent = `Anxiety: start ${formatPercent(entry.anxietyStart)} → end ${formatPercent(entry.anxietyEnd)}`;

    const thoughts = document.createElement('p');
    thoughts.textContent = entry.thoughts ? `Frightening thoughts: ${entry.thoughts}` : 'Frightening thoughts: (not recorded)';

    card.append(header, meta, savedAt, anxiety, thoughts);
    container.appendChild(card);
  });
}

function readForm(form) {
  const exposureType = form.exposureType.value.trim();
  const sessionDate = form.sessionDate.value;
  const timeSpent = form.timeSpent.value.trim();
  const anxietyStart = form.anxietyStart.value;
  const anxietyEnd = form.anxietyEnd.value;
  const thoughts = form.thoughts.value.trim();

  if (!exposureType) throw new Error('Enter the type of exposure.');
  if (!sessionDate) throw new Error('Select a date.');
  if (!timeSpent) throw new Error('Add how long you spent.');

  const startNumber = Number(anxietyStart);
  const endNumber = Number(anxietyEnd);
  const withinRange = (value) => Number.isFinite(value) && value >= 0 && value <= 100;
  if (!withinRange(startNumber) || !withinRange(endNumber)) {
    throw new Error('Anxiety scores must be between 0 and 100.');
  }

  return {
    exposureType,
    sessionDate,
    timeSpent,
    anxietyStart: startNumber,
    anxietyEnd: endNumber,
    thoughts,
  };
}

function init() {
  const form = document.getElementById('phobia-form');
  const status = document.getElementById('form-status');
  const cancelEdit = document.getElementById('cancel-edit');
  const entriesContainer = document.getElementById('entries');

  let editId = null;

  function handleEdit(entry) {
    editId = entry.id;
    form.exposureType.value = entry.exposureType;
    form.sessionDate.value = entry.sessionDate;
    form.timeSpent.value = entry.timeSpent;
    form.anxietyStart.value = entry.anxietyStart;
    form.anxietyEnd.value = entry.anxietyEnd;
    form.thoughts.value = entry.thoughts;
    cancelEdit.hidden = false;
    status.textContent = 'Loaded this session for editing. Saving will replace the existing copy.';
  }

  function handleDelete(entry) {
    const confirmed = window.confirm('Delete this session from this device?');
    if (!confirmed) return;
    const remaining = getEntries().filter((item) => item.id !== entry.id);
    persistEntries(remaining);
    refresh();
    status.textContent = 'Deleted.';
    if (editId === entry.id) {
      editId = null;
      form.reset();
      cancelEdit.hidden = true;
    }
  }

  function refresh() {
    renderEntries(entriesContainer, getEntries(), { onEdit: handleEdit, onDelete: handleDelete });
  }

  refresh();

  cancelEdit.addEventListener('click', () => {
    editId = null;
    form.reset();
    cancelEdit.hidden = true;
    status.textContent = 'Edit cancelled. The saved version remains unchanged.';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const entry = readForm(form);
      const payload = { ...entry, id: editId ?? createLocalId(), savedAt: new Date().toISOString() };
      const existing = getEntries();
      const updated = editId
        ? existing.map((item) => (item.id === editId ? payload : item))
        : [...existing, payload];
      persistEntries(updated);
      refresh();
      form.reset();
      cancelEdit.hidden = true;
      editId = null;
      status.textContent = 'Saved locally.';
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

init();
