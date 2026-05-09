import { formatTimestamp, renderHistoryEntries } from '../shared/history-ui.js';
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


export function renderEntries(container, entries, { onSelect, onDelete }) {
  renderHistoryEntries(container, entries, {
    emptyText: 'No exposure sessions saved yet.',
    toTitle: (entry) => `${entry.sessionDate} · Recorded ${formatTimestamp(entry.createdAt)}`,
    toFields: buildEntryDetailsFields,
    onSelect,
    onDelete,
  });
}

function buildEntryDetailsFields(entry) {
  const fields = [['Exposure focus', entry.focus], ['Date', entry.sessionDate]];
  if (entry.location) fields.push(['Location or setting', entry.location]);
  if (entry.plannedStep) fields.push(['Planned step', entry.plannedStep]);
  if (entry.startLevel || entry.startLevel === 0) fields.push(['Starting intensity (0-100)', `${entry.startLevel}%`]);
  if (entry.peakLevel || entry.peakLevel === 0) fields.push(['Peak intensity (0-100)', `${entry.peakLevel}%`]);
  if (entry.sensations) fields.push(['Sensations or thoughts noticed', entry.sensations]);
  if (entry.observations) fields.push(['Observations during the session', entry.observations]);
  return fields;
}
