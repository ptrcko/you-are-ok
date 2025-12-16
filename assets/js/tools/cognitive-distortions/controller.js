import { createEntry, getDistortionOptions, listEntries, loadEntry, saveEntry, deleteEntry } from './data.js';
import {
  getPageElements,
  loadEntryIntoForm,
  renderDistortionChecklist,
  renderEntries,
  resetFormState,
  setStatus,
} from './ui.js';

// Connects the Cognitive Distortions UI to the storage-backed data helpers.
export function initCognitiveDistortions() {
  const { form, statusEl, entriesContainer, cancelEditButton, checklistContainer } = getPageElements();
  let editingId = null;

  renderDistortionChecklist(checklistContainer, getDistortionOptions());

  function refreshList() {
    const entries = listEntries();
    renderEntries(entriesContainer, entries, {
      onSelect(entry) {
        editingId = entry.id;
        loadEntryIntoForm(form, cancelEditButton, entry, getDistortionOptions());
        setStatus(statusEl, 'Editing saved entry. Saving will update it locally.');
      },
      onDelete(entry) {
        const confirmed = window.confirm('Delete this entry? This only affects your local data.');
        if (!confirmed) return;
        deleteEntry(entry.id);
        if (editingId === entry.id) {
          editingId = null;
          resetFormState(form, cancelEditButton);
          setStatus(statusEl, '');
        }
        refreshList();
      },
    }, getDistortionOptions());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const existing = editingId ? loadEntry(editingId) : null;
    const entry = createEntry(form, editingId, existing?.createdAt);

    if (!entry) {
      setStatus(statusEl, 'Include a thought and choose at least one distortion from the checklist.');
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
