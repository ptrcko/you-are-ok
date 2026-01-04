import { createLocalId } from '../shared/ids.js';

const STORAGE_KEY = 'positive-record-entries';

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
    console.error('Unable to read stored entries', error);
    return [];
  }
}

function persistEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function buildPositiveChip(text) {
  const chip = document.createElement('span');
  chip.className = 'pill';
  chip.textContent = text;
  return chip;
}

function renderEntries(container, entries, callbacks) {
  container.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No entries saved on this device yet.';
    container.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'saved-card';

    const header = document.createElement('div');
    header.className = 'saved-card__header';

    const title = document.createElement('h3');
    title.textContent = entry.focus ? `Thought/feeling: ${entry.focus}` : 'Thought/feeling not recorded';
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

    const positives = document.createElement('div');
    positives.className = 'pill-row';
    if (entry.positives.length) {
      entry.positives.forEach((item) => positives.appendChild(buildPositiveChip(item)));
    } else {
      const note = document.createElement('p');
      note.textContent = 'No positives recorded yet.';
      positives.appendChild(note);
    }

    const notes = document.createElement('p');
    notes.textContent = entry.notes ? `Notes: ${entry.notes}` : 'Notes: (not recorded)';

    const savedAt = document.createElement('p');
    savedAt.className = 'hint';
    savedAt.textContent = formatTimestamp(entry.savedAt);

    card.append(header, savedAt, positives, notes);
    container.appendChild(card);
  });
}

function readForm(form) {
  const focus = form.focus.value.trim();
  const notes = form.notes.value.trim();
  const positives = Array.from(form.querySelectorAll('#positive-list .pill')).map((pill) => pill.textContent);

  if (!focus) throw new Error('Enter the thought or feeling you want to respond to.');
  if (!positives.length) throw new Error('Add at least one positive fact.');

  return { focus, notes, positives };
}

function init() {
  const form = document.getElementById('positive-record-form');
  const positiveInput = document.getElementById('positive-input');
  const addPositive = document.getElementById('add-positive');
  const positiveList = document.getElementById('positive-list');
  const status = document.getElementById('form-status');
  const cancelEdit = document.getElementById('cancel-edit');
  const entriesContainer = document.getElementById('entries');

  let editId = null;

  function handleEdit(entry) {
    editId = entry.id;
    form.focus.value = entry.focus;
    form.notes.value = entry.notes;
    positiveList.innerHTML = '';
    entry.positives.forEach((item) => positiveList.appendChild(buildPositiveChip(item)));
    cancelEdit.hidden = false;
    status.textContent = 'Loaded this entry for editing. Saving will replace the existing copy.';
  }

  function handleDelete(entry) {
    const confirmed = window.confirm('Delete this entry from this device?');
    if (!confirmed) return;
    const remaining = getEntries().filter((item) => item.id !== entry.id);
    persistEntries(remaining);
    refresh();
    status.textContent = 'Deleted.';
    if (editId === entry.id) {
      form.reset();
      positiveList.innerHTML = '';
      cancelEdit.hidden = true;
      editId = null;
    }
  }

  function refresh() {
    renderEntries(entriesContainer, getEntries(), { onEdit: handleEdit, onDelete: handleDelete });
  }

  addPositive.addEventListener('click', () => {
    const text = positiveInput.value.trim();
    if (!text) {
      status.textContent = 'Type a positive fact before adding it.';
      return;
    }
    positiveList.appendChild(buildPositiveChip(text));
    positiveInput.value = '';
    status.textContent = '';
  });

  refresh();

  cancelEdit.addEventListener('click', () => {
    editId = null;
    form.reset();
    positiveList.innerHTML = '';
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
      positiveList.innerHTML = '';
      cancelEdit.hidden = true;
      editId = null;
      status.textContent = 'Saved locally.';
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

init();
