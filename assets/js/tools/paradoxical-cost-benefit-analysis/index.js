import { createLocalId } from '../shared/ids.js';

const STORAGE_KEY = 'paradoxical-cba-entries';

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

function buildAdvantageChip(text) {
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
    title.textContent = `${entry.entryType === 'habit' ? 'Habit' : 'Thought'}: ${entry.focus || 'Untitled'}`;
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

    const advantages = document.createElement('div');
    advantages.className = 'pill-row';
    if (entry.advantages.length) {
      entry.advantages.forEach((item) => advantages.appendChild(buildAdvantageChip(item)));
    } else {
      const note = document.createElement('p');
      note.textContent = 'No advantages recorded.';
      advantages.appendChild(note);
    }

    const notes = document.createElement('p');
    notes.textContent = entry.notes ? `Notes: ${entry.notes}` : 'Notes: (not recorded)';

    card.append(header, advantages, notes);
    container.appendChild(card);
  });
}

function readForm(form) {
  const entryType = form.entryType.value === 'habit' ? 'habit' : 'thought';
  const focus = form.focus.value.trim();
  const notes = form.notes.value.trim();
  const advantages = Array.from(form.querySelectorAll('#advantage-list .pill')).map((pill) => pill.textContent);

  if (!focus) throw new Error('Enter the thought or habit you are focusing on.');
  if (!advantages.length) throw new Error('Add at least one advantage.');

  return { entryType, focus, notes, advantages };
}

function init() {
  const form = document.getElementById('paradoxical-form');
  const advantageInput = document.getElementById('advantage-input');
  const addAdvantage = document.getElementById('add-advantage');
  const advantageList = document.getElementById('advantage-list');
  const status = document.getElementById('form-status');
  const cancelEdit = document.getElementById('cancel-edit');
  const entriesContainer = document.getElementById('entries');

  let editId = null;

  function handleEdit(entry) {
    editId = entry.id;
    form.focus.value = entry.focus;
    form.notes.value = entry.notes;
    form.querySelector(`input[name="entryType"][value="${entry.entryType}"]`).checked = true;
    advantageList.innerHTML = '';
    entry.advantages.forEach((item) => advantageList.appendChild(buildAdvantageChip(item)));
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
      advantageList.innerHTML = '';
      cancelEdit.hidden = true;
      editId = null;
    }
  }

  function refresh() {
    renderEntries(entriesContainer, getEntries(), { onEdit: handleEdit, onDelete: handleDelete });
  }

  addAdvantage.addEventListener('click', () => {
    const text = advantageInput.value.trim();
    if (!text) {
      status.textContent = 'Type an advantage before adding it.';
      return;
    }
    advantageList.appendChild(buildAdvantageChip(text));
    advantageInput.value = '';
    status.textContent = '';
  });

  refresh();

  cancelEdit.addEventListener('click', () => {
    editId = null;
    form.reset();
    advantageList.innerHTML = '';
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
      advantageList.innerHTML = '';
      cancelEdit.hidden = true;
      editId = null;
      status.textContent = 'Saved locally.';
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

init();
