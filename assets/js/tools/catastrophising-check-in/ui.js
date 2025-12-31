// UI helpers for the Catastrophising Check-In tool. DOM-only with no storage access.
export function getPageElements() {
  return {
    form: document.querySelector('#catastrophising-form'),
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
  form.thought.value = entry.thought || '';
  form.context.value = entry.context || '';
  form.outcomeDate.value = entry.outcomeDate || '';
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function renderCheckIn(entry, checkIn, onSaveEvidence) {
  const wrapper = document.createElement('div');
  wrapper.className = 'check-in-block';

  const header = document.createElement('div');
  header.className = 'entry-header';
  const label = document.createElement('p');
  label.className = 'entry-title';
  label.textContent = checkIn.label;
  header.appendChild(label);

  const when = document.createElement('p');
  when.className = 'hint';
  when.textContent = `Planned for ${formatTimestamp(checkIn.promptAt)}`;
  header.appendChild(when);

  wrapper.appendChild(header);

  const thoughtLabel = document.createElement('p');
  thoughtLabel.className = 'item-heading';
  thoughtLabel.textContent = 'Original thought';
  wrapper.appendChild(thoughtLabel);

  const thought = document.createElement('p');
  thought.textContent = entry.thought;
  wrapper.appendChild(thought);

  const question = document.createElement('p');
  question.className = 'item-heading';
  question.textContent = 'What evidence do you have that this thought is correct?';
⁹  wrapper.appendChild(question);

  const response = document.createElement('textarea');
  response.rows = 3;
  response.value = checkIn.evidence || '';
  response.ariaLabel = 'Evidence';
  wrapper.appendChild(response);

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Save check-in';
  saveButton.addEventListener('click', () => onSaveEvidence(entry.id, checkIn.id, response.value));

  actions.appendChild(saveButton);

  if (checkIn.recordedAt) {
    const saved = document.createElement('p');
    saved.className = 'hint';
    saved.textContent = `Last noted ${formatTimestamp(checkIn.recordedAt)}`;
    actions.appendChild(saved);
  }

  wrapper.appendChild(actions);

  return wrapper;
}

export function renderEntries(container, entries, { onEdit, onDelete, onSaveEvidence }) {
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
    title.textContent = 'Thought captured';
    header.appendChild(title);

    const buttons = document.createElement('div');
    buttons.className = 'entry-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => onEdit(entry));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => onDelete(entry));

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);
    header.appendChild(buttons);

    item.appendChild(header);

    const meta = document.createElement('p');
    meta.className = 'hint';
    meta.textContent = `Saved ${formatTimestamp(entry.createdAt)}`;
    item.appendChild(meta);

    const thought = document.createElement('p');
    thought.textContent = entry.thought;
    item.appendChild(thought);

    if (entry.context) {
      const contextLabel = document.createElement('p');
      contextLabel.className = 'item-heading';
      contextLabel.textContent = 'Context';
      item.appendChild(contextLabel);

      const contextText = document.createElement('p');
      contextText.textContent = entry.context;
      item.appendChild(contextText);
    }

    if (entry.outcomeDate) {
      const outcome = document.createElement('p');
      outcome.className = 'hint';
      outcome.textContent = `Outcome date: ${entry.outcomeDate}`;
      item.appendChild(outcome);
    }

    const checkInLabel = document.createElement('p');
    checkInLabel.className = 'item-heading';
    checkInLabel.textContent = 'Check-ins';
    item.appendChild(checkInLabel);

    const checkInWrapper = document.createElement('div');
    checkInWrapper.className = 'check-in-list';
    (entry.checkIns || []).forEach((checkIn) => {
      checkInWrapper.appendChild(renderCheckIn(entry, checkIn, onSaveEvidence));
    });
    item.appendChild(checkInWrapper);

    list.appendChild(item);
  });

  container.appendChild(list);
}
