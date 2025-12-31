import {
  createEntryFromForm,
  deleteEntry,
  listEntries,
  loadEntry,
  saveCheckInEvidence,
  saveEntry,
} from './data.js';
import { getPageElements, loadEntryIntoForm, renderEntries, resetFormState, setStatus } from './ui.js';

export function initCatastrophisingCheckIn() {
  const { form, statusEl, cancelEditButton, entriesContainer } = getPageElements();
  let editingId = null;

  function refreshList() {
    const entries = listEntries();
    renderEntries(entriesContainer, entries, {
      onEdit(entry) {
        editingId = entry.id;
        loadEntryIntoForm(form, cancelEditButton, entry);
        setStatus(statusEl, 'Editing saved entry. Saving will update it locally.');
      },
      onDelete(entry) {
        const confirmed = window.confirm('Delete this entry from this device?');
        if (!confirmed) return;
        deleteEntry(entry.id);
        if (editingId === entry.id) {
          editingId = null;
          resetFormState(form, cancelEditButton);
        }
        setStatus(statusEl, 'Entry removed.');
        refreshList();
      },
      onSaveEvidence(entryId, checkInId, evidence) {
        const entry = loadEntry(entryId);
        const checkInLabel = entry?.checkIns?.find((item) => item.id === checkInId)?.label || 'Check-in';
        const updated = saveCheckInEvidence(entryId, checkInId, evidence);
        if (!updated) {
          setStatus(statusEl, 'Unable to save check-in.');
          return;
        }
        setStatus(statusEl, `${checkInLabel} saved.`);
        refreshList();
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const existing = editingId ? loadEntry(editingId) : null;
    const entry = createEntryFromForm(form, existing);

    if (!entry) {
      setStatus(statusEl, 'Add the thought before saving.');
      return;
    }

    saveEntry(entry);
    setStatus(statusEl, 'Saved locally.');
    editingId = null;
    resetFormState(form, cancelEditButton);
    refreshList();
  }

  function handleCancel() {
    editingId = null;
    resetFormState(form, cancelEditButton);
    setStatus(statusEl, '');
  }

  form.addEventListener('submit', handleSubmit);
  cancelEditButton.addEventListener('click', handleCancel);

  refreshList();
}
