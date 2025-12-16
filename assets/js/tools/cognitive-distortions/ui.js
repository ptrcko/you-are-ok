// UI helpers for the Cognitive Distortions tool. DOM-only with no storage access.
export function getPageElements() {
  return {
    form: document.querySelector('#distortion-form'),
    statusEl: document.querySelector('#form-status'),
    entriesContainer: document.querySelector('#entries'),
    cancelEditButton: document.querySelector('#cancel-edit'),
    checklistContainer: document.querySelector('#distortion-checklist'),
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

export function loadEntryIntoForm(form, cancelEditButton, entry, options) {
  form.thought.value = entry.thought;
  form.notes.value = entry.notes || '';
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;

  const codes = new Set(entry.distortions || []);
  options.forEach((distortion) => {
    const checkbox = form.querySelector(`input[name="distortions"][value="${distortion.code}"]`);
    if (checkbox) {
      checkbox.checked = codes.has(distortion.code);
    }
  });
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function renderDistortionChecklist(container, options) {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'checklist';

  options.forEach((distortion) => {
    const item = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'checkbox-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'distortions';
    checkbox.value = distortion.code;

    const text = document.createElement('div');
    const title = document.createElement('span');
    title.className = 'checkbox-title';
    title.textContent = `${distortion.label} (${distortion.code})`;

    const description = document.createElement('p');
    description.className = 'hint';
    description.textContent = distortion.description;

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
  const map = new Map(options.map((item) => [item.code, item.label]));
  return codes.map((code) => map.get(code) || code);
}

function buildEntryDetails(entry, options) {
  const rawList = document.createElement('dl');
  rawList.className = 'entry-details';

  const fields = [
    ['Thought', entry.thought],
    ['Distortions', mapCodesToLabels(entry.distortions || [], options).join(', ')],
  ];

  if (entry.notes) {
    fields.push(['Notes or reflections', entry.notes]);
  }

  fields.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    rawList.appendChild(dt);
    rawList.appendChild(dd);
  });

  return rawList;
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

    item.appendChild(buildEntryDetails(entry, options));
    list.appendChild(item);
  });

  container.appendChild(list);
}
