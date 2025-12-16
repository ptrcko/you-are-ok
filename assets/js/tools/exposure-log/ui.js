// UI helpers for the Exposure Log tool.
export function getPageElements() {
  return {
    form: document.querySelector('#exposure-form'),
    statusEl: document.querySelector('#form-status'),
    cancelEditButton: document.querySelector('#cancel-edit'),
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
  form.focus.value = entry.focus || '';
  form.sessionDate.value = entry.sessionDate || '';
  form.location.value = entry.location || '';
  form.plannedStep.value = entry.plannedStep || '';
  form.startLevel.value = entry.startLevel ?? '';
  form.peakLevel.value = entry.peakLevel ?? '';
  form.sensations.value = entry.sensations || '';
  form.observations.value = entry.observations || '';
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function buildEntryDetails(entry) {
  const list = document.createElement('dl');
  list.className = 'entry-details';

  const fields = [
    ['Exposure focus', entry.focus],
    ['Date', entry.sessionDate],
  ];

  if (entry.location) fields.push(['Location or setting', entry.location]);
  if (entry.plannedStep) fields.push(['Planned step', entry.plannedStep]);
  if (entry.startLevel || entry.startLevel === 0) fields.push(['Starting intensity (0-100)', `${entry.startLevel}%`]);
  if (entry.peakLevel || entry.peakLevel === 0) fields.push(['Peak intensity (0-100)', `${entry.peakLevel}%`]);
  if (entry.sensations) fields.push(['Sensations or thoughts noticed', entry.sensations]);
  if (entry.observations) fields.push(['Observations during the session', entry.observations]);

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

export function renderEntries(container, entries, { onSelect, onDelete }) {
  container.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No exposure sessions saved yet.';
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
    title.textContent = `${entry.sessionDate} · Recorded ${formatTimestamp(entry.createdAt)}`;
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

    item.appendChild(buildEntryDetails(entry));
    list.appendChild(item);
  });

  container.appendChild(list);
}
