// UI helpers for the Cognitive Distortion Identification tool. DOM-only.
export function getPageElements() {
  return {
    form: document.querySelector('#identification-form'),
    statusEl: document.querySelector('#form-status'),
    cancelEditButton: document.querySelector('#cancel-edit'),
    checklistContainer: document.querySelector('#distortion-checklist'),
    entriesContainer: document.querySelector('#entries'),
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
  form.statement.value = entry.statement || '';
  form.reflections.value = entry.reflections || '';
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;
}

export function renderDistortionChecklist(container, options) {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'checklist';

  options.forEach((option) => {
    const item = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'checkbox-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'distortions';
    checkbox.value = option.code;

    const text = document.createElement('div');
    const title = document.createElement('span');
    title.className = 'checkbox-title';
    title.textContent = `${option.label} (${option.code})`;

    const description = document.createElement('p');
    description.className = 'hint';
    description.textContent = option.description;

    text.appendChild(title);
    text.appendChild(description);

    label.appendChild(checkbox);
    label.appendChild(text);
    item.appendChild(label);
    list.appendChild(item);
  });

  container.appendChild(list);
}

function mapCodesToLabels(codes, options) {
  const lookup = new Map(options.map((option) => [option.code, option.label]));
  return codes.map((code) => lookup.get(code) || code);
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function buildEntryDetails(entry, options) {
  const list = document.createElement('dl');
  list.className = 'entry-details';

  const fields = [
    ['Statement', entry.statement],
    ['Distortions noted', mapCodesToLabels(entry.distortions || [], options).join(', ')],
  ];

  if (entry.reflections) {
    fields.push(['Notes or reflections', entry.reflections]);
  }

  fields.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    list.appendChild(dt);
    list.appendChild(dd);
  });

  return list;
}

export function renderEntries(container, entries, { onSelect, onDelete }, options) {
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
    title.textContent = `Recorded ${formatTimestamp(entry.createdAt)}`;
    header.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.textContent = 'Open';
    openButton.addEventListener('click', () => onSelect(entry));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => onDelete(entry));

    actions.append(openButton, deleteButton);
    header.appendChild(actions);
    item.appendChild(header);

    item.appendChild(buildEntryDetails(entry, options));
    list.appendChild(item);
  });

  container.appendChild(list);
}
