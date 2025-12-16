import { createLocalId } from '../shared/ids.js';

const STORAGE_KEY = 'fear-hierarchy-entries';
const LEVEL_COUNT = 10;

function getEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Unable to read stored hierarchies', error);
    return [];
  }
}

function persistEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function buildLevelRow(levelNumber, existingText = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'level-row';
  const label = document.createElement('label');
  label.setAttribute('for', `level-${levelNumber}`);
  label.textContent = `Level ${levelNumber}`;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = `level-${levelNumber}`;
  input.name = 'levels';
  input.value = existingText;
  input.placeholder = 'What I fear';
  input.setAttribute('data-level', String(levelNumber));

  wrapper.append(label, input);
  return wrapper;
}

function renderLevelInputs(container, existing = []) {
  container.innerHTML = '';
  for (let i = 1; i <= LEVEL_COUNT; i += 1) {
    const text = existing.find((item) => item.level === i)?.description ?? '';
    container.appendChild(buildLevelRow(i, text));
  }
}

function renderEntries(listEl, entries, callbacks) {
  listEl.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No hierarchies saved on this device yet.';
    listEl.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'saved-card';

    const header = document.createElement('div');
    header.className = 'saved-card__header';

    const title = document.createElement('h3');
    title.textContent = entry.fearSummary || 'Untitled hierarchy';
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

    const description = document.createElement('p');
    description.textContent = 'Levels from least to most frightening:';

    const list = document.createElement('ol');
    list.className = 'hierarchy-list';
    const sortedLevels = [...entry.levels].sort((a, b) => a.level - b.level);
    sortedLevels.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.description || 'No description provided';
      list.appendChild(li);
    });

    card.append(header, description, list);
    listEl.appendChild(card);
  });
}

function readForm(formEl) {
  const fearSummary = formEl.fearSummary.value.trim();
  const levelInputs = Array.from(formEl.querySelectorAll('input[name="levels"]'));
  const levels = levelInputs
    .map((input) => ({ level: Number(input.dataset.level), description: input.value.trim() }))
    .filter((item) => item.description);

  if (!fearSummary) {
    throw new Error('Please describe the fear you are mapping.');
  }

  if (!levels.length) {
    throw new Error('Add at least one level to keep the order meaningful.');
  }

  return { fearSummary, levels };
}

function init() {
  const form = document.getElementById('hierarchy-form');
  const levelsContainer = document.getElementById('levels-container');
  const status = document.getElementById('form-status');
  const cancelEdit = document.getElementById('cancel-edit');
  const entriesContainer = document.getElementById('entries');

  let editId = null;

  function handleEdit(entry) {
    editId = entry.id;
    form.fearSummary.value = entry.fearSummary;
    renderLevelInputs(levelsContainer, entry.levels);
    cancelEdit.hidden = false;
    status.textContent = 'Loaded this hierarchy for editing. Saving will replace the existing copy.';
  }

  function handleDelete(entry) {
    const confirmed = window.confirm('Delete this hierarchy from this device?');
    if (!confirmed) return;
    const remaining = getEntries().filter((item) => item.id !== entry.id);
    persistEntries(remaining);
    refreshEntries();
    status.textContent = 'Deleted.';
    if (editId === entry.id) {
      editId = null;
      form.reset();
      renderLevelInputs(levelsContainer);
      cancelEdit.hidden = true;
    }
  }

  function refreshEntries() {
    const entries = getEntries();
    renderEntries(entriesContainer, entries, {
      onEdit: handleEdit,
      onDelete: handleDelete,
    });
  }

  renderLevelInputs(levelsContainer);
  refreshEntries();

  cancelEdit.addEventListener('click', () => {
    editId = null;
    form.reset();
    renderLevelInputs(levelsContainer);
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
      refreshEntries();
      form.reset();
      renderLevelInputs(levelsContainer);
      cancelEdit.hidden = true;
      editId = null;
      status.textContent = 'Saved locally.';
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

init();
