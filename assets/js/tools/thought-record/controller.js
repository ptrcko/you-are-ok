import { createEntry, deleteEntry, listEntries, loadEntry, saveEntry } from './data.js';
import { getPageElements, loadEntryIntoForm, renderEntries, resetFormState, setStatus } from './ui.js';

export function initThoughtRecord() {
  const { form, statusEl, cancelEditButton, entriesContainer } = getPageElements();
  let editingId = null;

  function refreshList() {
    const entries = listEntries();
    renderEntries(entriesContainer, entries, {
      onSelect(entry) {
        editingId = entry.id;
        loadEntryIntoForm(form, cancelEditButton, entry);
        setStatus(statusEl, 'Editing saved entry. Saving will update it locally.');
      },
      onDelete(entry) {
        const confirmed = window.confirm('Delete this record from this device?');
        if (!confirmed) return;
        deleteEntry(entry.id);
        if (editingId === entry.id) {
          editingId = null;
          resetFormState(form, cancelEditButton);
        }
        setStatus(statusEl, 'Entry removed from this device.');
        refreshList();
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const existing = editingId ? loadEntry(editingId) : null;
    const entry = createEntry(form, editingId, existing?.createdAt);

    if (!entry) {
      setStatus(statusEl, 'Add the situation and automatic thought to save this record.');
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
