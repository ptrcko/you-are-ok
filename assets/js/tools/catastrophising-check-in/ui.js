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

function getCheckInTone(label) {
  const normalised = (label || '').toLowerCase();
  if (normalised.includes('15')) return 'check-in-early';
  if (normalised.includes('1-hour')) return 'check-in-mid';
  if (normalised.includes('4-hour')) return 'check-in-late';
  if (normalised.includes('outcome')) return 'check-in-outcome';
  return 'check-in-generic';
}

function renderCheckIn(entry, checkIn, onSaveEvidence) {
  const wrapper = document.createElement('div');
  const tone = getCheckInTone(checkIn.label);
  wrapper.className = `check-in-row ${tone}`;

  const header = document.createElement('div');
  header.className = 'check-in-row__header';

  const label = document.createElement('p');
  label.className = 'check-in-title';
  label.textContent = checkIn.label || 'Check-in';
  header.appendChild(label);

  const when = document.createElement('p');
  when.className = 'check-in-meta';
  when.textContent = `Planned for ${formatTimestamp(checkIn.promptAt)}`;
  header.appendChild(when);

  wrapper.appendChild(header);

  const thought = document.createElement('p');
  thought.className = 'check-in-thought';
  thought.textContent = entry.thought;
  wrapper.appendChild(thought);

  const evidenceBlock = document.createElement('div');
  evidenceBlock.className = 'evidence-block';

  const question = document.createElement('p');
  question.className = 'item-heading';
  question.textContent = 'Have you seen evidence—real proof—this is true?';
  evidenceBlock.appendChild(question);

  const options = document.createElement('div');
  options.className = 'evidence-options';

  const hasStoredAnswer = checkIn.evidenceAnswer === 'yes' || checkIn.evidenceAnswer === 'no';
  const hasStoredNote = typeof checkIn.evidenceNote === 'string' && checkIn.evidenceNote.trim().length;
  let selectedAnswer = hasStoredAnswer ? checkIn.evidenceAnswer : hasStoredNote ? 'yes' : null;

  const response = document.createElement('textarea');
  response.rows = 3;
  response.value = selectedAnswer === 'yes' ? checkIn.evidenceNote || '' : '';
  response.setAttribute('aria-label', `${checkIn.label || 'Check-in'} evidence details`);

  const followUp = document.createElement('div');
  followUp.className = 'evidence-follow-up';
  const followUpLabel = document.createElement('p');
  followUpLabel.className = 'item-heading';
  followUpLabel.textContent = 'What evidence have you seen?';
  followUp.appendChild(followUpLabel);
  followUp.appendChild(response);

  const noMessage = document.createElement('p');
  noMessage.className = 'evidence-message';
  noMessage.textContent = "No evidence can be a relief—notice the space between the thought and proof.";

  const yesButton = document.createElement('button');
  yesButton.type = 'button';
  yesButton.className = 'choice-chip';
  yesButton.textContent = 'Yes';

  const noButton = document.createElement('button');
  noButton.type = 'button';
  noButton.className = 'choice-chip';
  noButton.textContent = 'No';

  function applySelection(value) {
    selectedAnswer = value;
    yesButton.classList.toggle('is-selected', value === 'yes');
    noButton.classList.toggle('is-selected', value === 'no');
    followUp.hidden = value !== 'yes';
    noMessage.hidden = value !== 'no';
    wrapper.classList.toggle('check-in-row--no', value === 'no');
    if (value !== 'yes') {
      response.value = '';
    }
  }

  yesButton.addEventListener('click', () => applySelection('yes'));
  noButton.addEventListener('click', () => applySelection('no'));

  options.appendChild(yesButton);
  options.appendChild(noButton);
  evidenceBlock.appendChild(options);
  evidenceBlock.appendChild(noMessage);
  evidenceBlock.appendChild(followUp);

  wrapper.appendChild(evidenceBlock);
  applySelection(selectedAnswer);

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.textContent = 'Save check-in';
  saveButton.addEventListener('click', () =>
    onSaveEvidence(entry.id, checkIn.id, {
      answer: selectedAnswer,
      note: selectedAnswer === 'yes' ? response.value : '',
    })
  );

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
