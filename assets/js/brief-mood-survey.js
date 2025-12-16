import { listEntriesByType, upsertEntry, markEntryDeleted, getEntry } from './storage.js';

const form = document.querySelector('#mood-form');
const statusEl = document.querySelector('#form-status');
const entriesContainer = document.querySelector('#entries');
const cancelEditButton = document.querySelector('#cancel-edit');

let editingId = null;

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseScoresInput(value) {
  if (!value.trim()) return null;

  const parts = value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  const numbers = parts.map((part) => Number(part));
  const invalid = numbers.some((num) => Number.isNaN(num) || num < 0 || num > 4);
  if (invalid || numbers.length === 0) {
    return null;
  }
  return numbers;
}

function buildScoresFromForm() {
  const anxietyFeelings = parseScoresInput(form.anxietyFeelings.value);
  const anxietyPhysical = parseScoresInput(form.anxietyPhysical.value);
  const depression = parseScoresInput(form.depression.value);
  const suicidalUrges = parseScoresInput(form.suicidalUrges.value);

  if (!anxietyFeelings || !anxietyPhysical || !depression || !suicidalUrges) {
    return null;
  }

  return {
    anxiety_feelings: anxietyFeelings,
    anxiety_physical: anxietyPhysical,
    depression,
    suicidal_urges: suicidalUrges,
  };
}

function totalsFromScores(scores) {
  return {
    anxiety_feelings: scores.anxiety_feelings.reduce((sum, value) => sum + value, 0),
    anxiety_physical: scores.anxiety_physical.reduce((sum, value) => sum + value, 0),
    depression: scores.depression.reduce((sum, value) => sum + value, 0),
    suicidal_urges: scores.suicidal_urges.reduce((sum, value) => sum + value, 0),
  };
}

function setStatus(message) {
  statusEl.textContent = message;
}

function resetForm() {
  form.reset();
  editingId = null;
  cancelEditButton.hidden = true;
  form.dataset.mode = 'create';
  setStatus('');
}

function loadEntryIntoForm(entry) {
  form.anxietyFeelings.value = entry.scores.anxiety_feelings.join(', ');
  form.anxietyPhysical.value = entry.scores.anxiety_physical.join(', ');
  form.depression.value = entry.scores.depression.join(', ');
  form.suicidalUrges.value = entry.scores.suicidal_urges.join(', ');
  editingId = entry.id;
  form.dataset.mode = 'edit';
  cancelEditButton.hidden = false;
  setStatus('Editing existing entry. Saving will update it locally.');
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function renderEntries() {
  const entries = listEntriesByType('mood_survey').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  entriesContainer.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No entries saved yet.';
    entriesContainer.appendChild(empty);
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
    openButton.addEventListener('click', () => loadEntryIntoForm(entry));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      const confirmed = window.confirm('Delete this entry? This only affects your local data.');
      if (!confirmed) return;
      markEntryDeleted(entry.id);
      if (editingId === entry.id) {
        resetForm();
      }
      renderEntries();
    });

    buttons.appendChild(openButton);
    buttons.appendChild(deleteButton);
    header.appendChild(buttons);
    item.appendChild(header);

    const rawList = document.createElement('dl');
    rawList.className = 'entry-details';

    const fields = [
      ['Anxiety (feelings)', entry.scores.anxiety_feelings.join(', ')],
      ['Anxiety (physical)', entry.scores.anxiety_physical.join(', ')],
      ['Depression', entry.scores.depression.join(', ')],
      ['Suicidal urges', entry.scores.suicidal_urges.join(', ')],
      ['Totals', `Feelings ${entry.totals.anxiety_feelings}, Physical ${entry.totals.anxiety_physical}, Depression ${entry.totals.depression}, Suicidal urges ${entry.totals.suicidal_urges}`],
    ];

    fields.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      rawList.appendChild(dt);
      rawList.appendChild(dd);
    });

    item.appendChild(rawList);
    list.appendChild(item);
  });

  entriesContainer.appendChild(list);
}

function handleSubmit(event) {
  event.preventDefault();
  const scores = buildScoresFromForm();

  if (!scores) {
    setStatus('Use numbers between 0 and 4, separated by commas for each field.');
    return;
  }

  const entry = {
    id: editingId || createId(),
    type: 'mood_survey',
    scores,
    totals: totalsFromScores(scores),
  };

  const stored = getEntry(entry.id);
  if (stored?.createdAt) {
    entry.createdAt = stored.createdAt;
  }

  upsertEntry(entry);
  setStatus('Saved locally.');
  resetForm();
  renderEntries();
}

form.addEventListener('submit', handleSubmit);
cancelEditButton.addEventListener('click', resetForm);

renderEntries();
