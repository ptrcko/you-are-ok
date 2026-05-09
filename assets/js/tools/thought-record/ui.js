import { formatTimestamp, renderHistoryEntries } from '../shared/history-ui.js';
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


export function renderEntries(container, entries, { onSelect, onDelete }) {
  renderHistoryEntries(container, entries, {
    emptyText: 'No thought records saved yet.',
    toTitle: (entry) => `Recorded ${formatTimestamp(entry.createdAt)}`,
    toFields: buildEntryDetailsFields,
    onSelect,
    onDelete,
  });
}

function buildEntryDetailsFields(entry) {
  const fields = [['Situation', entry.situation], ['Automatic thought', entry.automaticThought]];
  if (entry.feelings) fields.push(['Feelings', entry.feelings]);
  if (entry.supportingEvidence) fields.push(['Supporting evidence', entry.supportingEvidence]);
  if (entry.contradictingEvidence) fields.push(['Contradicting evidence', entry.contradictingEvidence]);
  if (entry.balancedResponse) fields.push(['Balanced response or next step', entry.balancedResponse]);
  return fields;
}
