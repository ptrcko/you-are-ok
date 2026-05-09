import { formatTimestamp, renderHistoryEntries } from '../shared/history-ui.js';
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


export function renderEntries(container, entries, { onSelect, onDelete }) {
  renderHistoryEntries(container, entries, {
    emptyText: 'No entries saved yet.',
    toTitle: (entry) => `Recorded ${formatTimestamp(entry.createdAt)}`,
    toFields: buildEntryDetailsFields,
    onSelect,
    onDelete,
  });
}

function buildEntryDetailsFields(entry) {
  return [
    ['Anxiety (feelings)', entry.scores.anxiety_feelings.join(', ')],
    ['Anxiety (physical)', entry.scores.anxiety_physical.join(', ')],
    ['Depression', entry.scores.depression.join(', ')],
    ['Suicidal urges', entry.scores.suicidal_urges.join(', ')],
    ['Totals', `Feelings ${entry.totals.anxiety_feelings}, Physical ${entry.totals.anxiety_physical}, Depression ${entry.totals.depression}, Suicidal urges ${entry.totals.suicidal_urges}`],
  ];
}
