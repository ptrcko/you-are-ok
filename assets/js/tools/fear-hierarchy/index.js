import { createLocalId } from '../shared/ids.js';

const STORAGE_KEY = 'fear-hierarchy-entries';
const DEFAULT_LEVEL_HINT = 'Fear in the moment';

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

  const inputId = `level-${createLocalId()}`;

  const label = document.createElement('label');
  label.className = 'level-row__order';
  label.setAttribute('for', inputId);
  label.textContent = `Fear ${levelNumber}`;

  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'drag-handle';
  handle.setAttribute('aria-label', `Drag to reorder Fear ${levelNumber}`);
  handle.setAttribute('draggable', 'true');
  handle.textContent = '↕';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;
  input.name = 'levels';
  input.value = existingText;
  input.placeholder = DEFAULT_LEVEL_HINT;
  input.setAttribute('data-level', String(levelNumber));
  input.setAttribute('aria-label', `Fear ${levelNumber} description`);

  const actions = document.createElement('div');
  actions.className = 'level-row__actions';

  const moveUp = document.createElement('button');
  moveUp.type = 'button';
  moveUp.className = 'level-move';
  moveUp.dataset.move = 'up';
  moveUp.textContent = '↑';
  moveUp.setAttribute('aria-label', `Move Fear ${levelNumber} up`);

  const moveDown = document.createElement('button');
  moveDown.type = 'button';
  moveDown.className = 'level-move';
  moveDown.dataset.move = 'down';
  moveDown.textContent = '↓';
  moveDown.setAttribute('aria-label', `Move Fear ${levelNumber} down`);

  actions.append(moveUp, moveDown);

  wrapper.append(label, handle, input, actions);
  return wrapper;
}

function renderLevelInputs(container, existing = []) {
  container.innerHTML = '';
  existing.forEach((text, index) => {
    container.appendChild(buildLevelRow(index + 1, text ?? ''));
  });
}

function normalizeFears(entry) {
  if (Array.isArray(entry.fears)) {
    return entry.fears.filter(Boolean);
  }
  if (Array.isArray(entry.levels)) {
    return entry.levels
      .map((item) => (typeof item === 'string' ? item : item.description ?? item.fear ?? ''))
      .filter(Boolean);
  }
  return [];
}

function renderEntries(listEl, entries, callbacks) {
  listEl.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No fear lists saved on this device yet.';
    listEl.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'saved-card';

    const header = document.createElement('div');
    header.className = 'saved-card__header';

    const title = document.createElement('h3');
    const fears = normalizeFears(entry);
    const titleSuffix = fears.length ? ` (${fears.length})` : '';
    title.textContent = `Fear list${titleSuffix}`;
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
    description.textContent = 'Fears in the order you set:';

    const saved = document.createElement('p');
    saved.className = 'hint';
    saved.textContent = formatTimestamp(entry.savedAt);

    const list = document.createElement('ol');
    list.className = 'hierarchy-list';
    fears.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item || 'No description provided';
      list.appendChild(li);
    });

    card.append(header, saved, description, list);

    if (entry.comments) {
      const commentsLabel = document.createElement('p');
      commentsLabel.className = 'item-heading';
      commentsLabel.textContent = 'Comments';
      const comments = document.createElement('p');
      comments.className = 'data-text';
      comments.textContent = entry.comments;
      card.append(commentsLabel, comments);
    }
    listEl.appendChild(card);
  });
}

function readForm(formEl) {
  const levelRows = Array.from(formEl.querySelectorAll('.level-row'));
  const fears = levelRows
    .map((row, index) => {
      const input = row.querySelector('input[name="levels"]');
      return input.value.trim();
    })
    .filter(Boolean);

  if (!fears.length) {
    throw new Error('Add at least one fear to keep the list meaningful.');
  }

  const comments = formEl.comments.value.trim();
  return { fears, comments };
}

function init() {
  const form = document.getElementById('hierarchy-form');
  const levelsContainer = document.getElementById('levels-container');
  const status = document.getElementById('form-status');
  const cancelEdit = document.getElementById('cancel-edit');
  const addFearButton = document.getElementById('add-fear');
  const entriesContainer = document.getElementById('entries');

  let editId = null;
  let draggedRow = null;

  function updateLevelOrder() {
    const rows = Array.from(levelsContainer.querySelectorAll('.level-row'));
    rows.forEach((row, index) => {
      const levelNumber = index + 1;
      const label = row.querySelector('.level-row__order');
      const input = row.querySelector('input[name="levels"]');
      const moveUp = row.querySelector('[data-move="up"]');
      const moveDown = row.querySelector('[data-move="down"]');
      const handle = row.querySelector('.drag-handle');

      row.dataset.level = String(levelNumber);
      label.textContent = `Fear ${levelNumber}`;
      label.setAttribute('for', input.id);
      input.dataset.level = String(levelNumber);
      input.setAttribute('aria-label', `Fear ${levelNumber} description`);

      moveUp.disabled = index === 0;
      moveDown.disabled = index === rows.length - 1;
      moveUp.setAttribute('aria-label', `Move Fear ${levelNumber} up`);
      moveDown.setAttribute('aria-label', `Move Fear ${levelNumber} down`);
      handle.setAttribute('aria-label', `Drag to reorder Fear ${levelNumber}`);
    });
  }

  function moveRow(row, direction) {
    if (!row) return;
    if (direction === 'up' && row.previousElementSibling) {
      levelsContainer.insertBefore(row, row.previousElementSibling);
    }
    if (direction === 'down' && row.nextElementSibling) {
      levelsContainer.insertBefore(row.nextElementSibling, row);
    }
    updateLevelOrder();
  }

  function addLevelRow(text = '') {
    const nextIndex = levelsContainer.children.length + 1;
    levelsContainer.appendChild(buildLevelRow(nextIndex, text));
    updateLevelOrder();
  }

  function handleEdit(entry) {
    editId = entry.id;
    form.comments.value = entry.comments ?? '';
    renderLevelInputs(levelsContainer, normalizeFears(entry));
    updateLevelOrder();
    cancelEdit.hidden = false;
    status.textContent = 'Loaded this list for editing. Saving will replace the existing copy.';
  }

  function handleDelete(entry) {
    const confirmed = window.confirm('Delete this fear list from this device?');
    if (!confirmed) return;
    const remaining = getEntries().filter((item) => item.id !== entry.id);
    persistEntries(remaining);
    refreshEntries();
    status.textContent = 'Deleted.';
    if (editId === entry.id) {
      editId = null;
      form.reset();
      renderLevelInputs(levelsContainer);
      updateLevelOrder();
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
  updateLevelOrder();
  refreshEntries();

  addFearButton.addEventListener('click', () => {
    addLevelRow();
    status.textContent = '';
  });

  cancelEdit.addEventListener('click', () => {
    editId = null;
    form.reset();
    renderLevelInputs(levelsContainer);
    updateLevelOrder();
    cancelEdit.hidden = true;
    status.textContent = 'Edit cancelled. The saved version remains unchanged.';
  });

  levelsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.level-move');
    if (!button) return;
    const row = button.closest('.level-row');
    moveRow(row, button.dataset.move);
  });

  levelsContainer.addEventListener('dragstart', (event) => {
    const handle = event.target.closest('.drag-handle');
    if (!handle) {
      event.preventDefault();
      return;
    }
    const row = handle.closest('.level-row');
    if (!row) return;
    draggedRow = row;
    row.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', row.dataset.level ?? '');
  });

  levelsContainer.addEventListener('dragover', (event) => {
    if (!draggedRow) return;
    event.preventDefault();
    const row = event.target.closest('.level-row');
    if (!row || row === draggedRow) return;
    const { top, height } = row.getBoundingClientRect();
    const shouldInsertAfter = event.clientY > top + height / 2;
    levelsContainer.insertBefore(draggedRow, shouldInsertAfter ? row.nextSibling : row);
    updateLevelOrder();
  });

  levelsContainer.addEventListener('drop', (event) => {
    if (!draggedRow) return;
    event.preventDefault();
  });

  levelsContainer.addEventListener('dragend', () => {
    if (!draggedRow) return;
    draggedRow.classList.remove('is-dragging');
    draggedRow = null;
    updateLevelOrder();
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
      updateLevelOrder();
      cancelEdit.hidden = true;
      editId = null;
      status.textContent = 'Saved locally.';
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

init();
