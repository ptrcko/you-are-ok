// UI helpers for the Thought Record tool. DOM-only helpers.
export function getPageElements() {
  return {
    form: document.querySelector('#thought-record-form'),
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
  form.situation.value = entry.situation || '';
  form.automaticThought.value = entry.automaticThought || '';
  form.feelings.value = entry.feelings || '';
  form.supportingEvidence.value = entry.supportingEvidence || '';
  form.contradictingEvidence.value = entry.contradictingEvidence || '';
  form.balancedResponse.value = entry.balancedResponse || '';
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
    ['Situation', entry.situation],
    ['Automatic thought', entry.automaticThought],
  ];

  if (entry.feelings) fields.push(['Feelings', entry.feelings]);
  if (entry.supportingEvidence) fields.push(['Supporting evidence', entry.supportingEvidence]);
  if (entry.contradictingEvidence) fields.push(['Contradicting evidence', entry.contradictingEvidence]);
  if (entry.balancedResponse) fields.push(['Balanced response or next step', entry.balancedResponse]);

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
    empty.textContent = 'No thought records saved yet.';
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

    item.appendChild(buildEntryDetails(entry));
    list.appendChild(item);
  });

  container.appendChild(list);
}
