// UI-only helpers for the Brief Mood Survey tool. No storage or state lives here.
export function getPageElements() {
  return {
    form: document.querySelector('#mood-form'),
    statusEl: document.querySelector('#form-status'),
    entriesContainer: document.querySelector('#entries'),
    cancelEditButton: document.querySelector('#cancel-edit'),
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
  form.anxietyFeelings.value = entry.scores.anxiety_feelings.join(', ');
  form.anxietyPhysical.value = entry.scores.anxiety_physical.join(', ');
  form.depression.value = entry.scores.depression.join(', ');
  form.suicidalUrges.value = entry.scores.suicidal_urges.join(', ');
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function buildEntryDetails(entry) {
  const rawList = document.createElement('dl');
  rawList.className = 'entry-details';

  const fields = [
    ['Anxiety (feelings)', entry.scores.anxiety_feelings.join(', ')],
    ['Anxiety (physical)', entry.scores.anxiety_physical.join(', ')],
    ['Depression', entry.scores.depression.join(', ')],
    [
      'Suicidal urges',
      entry.scores.suicidal_urges.join(', '),
    ],
    [
      'Totals',
      `Feelings ${entry.totals.anxiety_feelings}, Physical ${entry.totals.anxiety_physical}, Depression ${entry.totals.depression}, Suicidal urges ${entry.totals.suicidal_urges}`,
    ],
  ];

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

    item.appendChild(buildEntryDetails(entry));
    list.appendChild(item);
  });

  container.appendChild(list);
}
