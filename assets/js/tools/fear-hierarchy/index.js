import { createLocalId } from '../shared/ids.js';

const STORAGE_KEY = 'fear-hierarchy-entries';
const LEVEL_COUNT = 10;
const DEFAULT_LEVEL_HINT = 'What I fear';

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
  label.textContent = `Level ${levelNumber}`;

  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'drag-handle';
  handle.setAttribute('aria-label', `Drag to reorder Level ${levelNumber}`);
  handle.setAttribute('draggable', 'true');
  handle.textContent = '↕';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;
  input.name = 'levels';
  input.value = existingText;
  input.placeholder = DEFAULT_LEVEL_HINT;
  input.setAttribute('data-level', String(levelNumber));
  input.setAttribute('aria-label', `Level ${levelNumber} description`);

  const actions = document.createElement('div');
  actions.className = 'level-row__actions';

  const moveUp = document.createElement('button');
  moveUp.type = 'button';
  moveUp.className = 'level-move';
  moveUp.dataset.move = 'up';
  moveUp.textContent = '↑';
  moveUp.setAttribute('aria-label', `Move Level ${levelNumber} up`);

  const moveDown = document.createElement('button');
  moveDown.type = 'button';
  moveDown.className = 'level-move';
  moveDown.dataset.move = 'down';
  moveDown.textContent = '↓';
  moveDown.setAttribute('aria-label', `Move Level ${levelNumber} down`);

  actions.append(moveUp, moveDown);

  wrapper.append(label, handle, input, actions);
  return wrapper;
}

function renderLevelInputs(container, existing = []) {
  container.innerHTML = '';
  const sorted = [...existing].sort((a, b) => a.level - b.level);
  for (let i = 1; i <= LEVEL_COUNT; i += 1) {
    const text = sorted[i - 1]?.description ?? '';
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

    const saved = document.createElement('p');
    saved.className = 'hint';
    saved.textContent = formatTimestamp(entry.savedAt);

    const list = document.createElement('ol');
    list.className = 'hierarchy-list';
    const sortedLevels = [...entry.levels].sort((a, b) => a.level - b.level);
    sortedLevels.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.description || 'No description provided';
      list.appendChild(li);
    });

    card.append(header, saved, description, list);
    listEl.appendChild(card);
  });
}

function readForm(formEl) {
  const fearSummary = formEl.fearSummary.value.trim();
  const levelRows = Array.from(formEl.querySelectorAll('.level-row'));
  const levels = levelRows
    .map((row, index) => {
      const input = row.querySelector('input[name="levels"]');
      return { level: index + 1, description: input.value.trim() };
    })
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
      label.textContent = `Level ${levelNumber}`;
      label.setAttribute('for', input.id);
      input.dataset.level = String(levelNumber);
      input.setAttribute('aria-label', `Level ${levelNumber} description`);

      moveUp.disabled = index === 0;
      moveDown.disabled = index === rows.length - 1;
      moveUp.setAttribute('aria-label', `Move Level ${levelNumber} up`);
      moveDown.setAttribute('aria-label', `Move Level ${levelNumber} down`);
      handle.setAttribute('aria-label', `Drag to reorder Level ${levelNumber}`);
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

  function handleEdit(entry) {
    editId = entry.id;
    form.fearSummary.value = entry.fearSummary;
    renderLevelInputs(levelsContainer, entry.levels);
    updateLevelOrder();
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
