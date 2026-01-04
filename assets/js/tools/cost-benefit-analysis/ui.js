// UI helpers for the Cost–Benefit Analysis tool. DOM-only with no storage access.
export function getPageElements() {
  return {
    form: document.querySelector('#cba-form'),
    statusEl: document.querySelector('#form-status'),
    entriesContainer: document.querySelector('#entries'),
    cancelEditButton: document.querySelector('#cancel-edit'),
    advantageInput: document.querySelector('#advantage-input'),
    disadvantageInput: document.querySelector('#disadvantage-input'),
    advantageList: document.querySelector('#advantage-list'),
    disadvantageList: document.querySelector('#disadvantage-list'),
    sideButtons: Array.from(document.querySelectorAll('.segment')),
    panels: Array.from(document.querySelectorAll('.side-panel')),
    addAdvantageButton: document.querySelector('#add-advantage'),
    addDisadvantageButton: document.querySelector('#add-disadvantage'),
  };
}

export function setStatus(statusEl, message) {
  statusEl.textContent = message;
}

export function resetFormState(form, cancelEditButton) {
  form.reset();
  form.dataset.mode = 'create';
  cancelEditButton.hidden = true;
}

export function loadEntryIntoForm(form, cancelEditButton, entry) {
  form.focus.value = entry.focus || '';
  form.notes.value = entry.notes || '';
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;
}

export function setActiveSide(buttons, panels, active) {
  buttons.forEach((button) => {
    const isActive = button.dataset.side === active;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.side === active;
    panel.hidden = !isActive;
  });
}

function buildListItem(item, onEdit, onDelete) {
  const wrapper = document.createElement('div');
  wrapper.className = 'item-row';

  const text = document.createElement('p');
  text.className = 'item-text data-text';
  text.textContent = item.text;

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'secondary';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => onEdit(item.id));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'secondary';
  deleteButton.textContent = 'Remove';
  deleteButton.addEventListener('click', () => onDelete(item.id));

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  wrapper.appendChild(text);
  wrapper.appendChild(actions);

  return wrapper;
}

export function renderItems(container, items, onEdit, onDelete) {
  container.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'No items added yet.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'item-list-inner';

  items.forEach((item) => {
    list.appendChild(buildListItem(item, onEdit, onDelete));
  });

  container.appendChild(list);
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function renderSideList(title, items) {
  const block = document.createElement('div');
  const heading = document.createElement('p');
  heading.className = 'item-heading';
  heading.textContent = title;
  block.appendChild(heading);

  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'Nothing noted yet.';
    block.appendChild(empty);
    return block;
  }

  const list = document.createElement('ul');
  list.className = 'bullet-list';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.text;
    list.appendChild(li);
  });

  block.appendChild(list);
  return block;
}

export function renderEntries(container, entries, { onSelect, onDelete }) {
  container.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No entries saved yet.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'entry-list';

  entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'entry-card';

    const header = document.createElement('div');
    header.className = 'entry-header';
    const title = document.createElement('p');
    title.className = 'entry-title';
    title.textContent = entry.focus;
    header.appendChild(title);

    const buttons = document.createElement('div');
    buttons.className = 'entry-actions';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.textContent = 'Open';
    openButton.addEventListener('click', () => onSelect(entry));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => onDelete(entry));

    buttons.appendChild(openButton);
    buttons.appendChild(deleteButton);
    header.appendChild(buttons);
    item.appendChild(header);

    const meta = document.createElement('p');
    meta.className = 'hint';
    meta.textContent = `Saved ${formatTimestamp(entry.createdAt)}`;
    item.appendChild(meta);

    const details = document.createElement('div');
    details.className = 'dual-list';
    details.appendChild(renderSideList('Advantages noted', entry.advantages || []));
    details.appendChild(renderSideList('Disadvantages noted', entry.disadvantages || []));
    item.appendChild(details);

    if (entry.notes) {
      const notesLabel = document.createElement('p');
      notesLabel.className = 'item-heading';
      notesLabel.textContent = 'Notes';
      item.appendChild(notesLabel);

      const notes = document.createElement('p');
      notes.className = 'data-text';
      notes.textContent = entry.notes;
      item.appendChild(notes);
    }

    list.appendChild(item);
  });

  container.appendChild(list);
}
