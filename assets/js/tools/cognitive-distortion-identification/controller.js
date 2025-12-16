import { createEntry, deleteEntry, listEntries, loadEntry, loadOptions, saveEntry } from './data.js';
import {
  getPageElements,
  loadEntryIntoForm,
  renderDistortionChecklist,
  renderEntries,
  resetFormState,
  setStatus,
} from './ui.js';

export function initDistortionIdentification() {
  const { form, statusEl, cancelEditButton, checklistContainer, entriesContainer } = getPageElements();
  const options = loadOptions();
  let editingId = null;

  renderDistortionChecklist(checklistContainer, options);

  function refreshList() {
    const entries = listEntries();
    renderEntries(entriesContainer, entries, {
      onSelect(entry) {
        editingId = entry.id;
        loadEntryIntoForm(form, cancelEditButton, entry);

        const selected = new Set(entry.distortions || []);
        form.querySelectorAll('input[name="distortions"]').forEach((checkbox) => {
          checkbox.checked = selected.has(checkbox.value);
        });

        setStatus(statusEl, 'Editing saved entry. Saving will update it locally.');
      },
      onDelete(entry) {
        const confirmed = window.confirm('Delete this entry? This only changes data on this device.');
        if (!confirmed) return;
        deleteEntry(entry.id);
        if (editingId === entry.id) {
          editingId = null;
          resetFormState(form, cancelEditButton);
        }
        setStatus(statusEl, 'Entry removed.');
        refreshList();
      },
    }, options);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const existing = editingId ? loadEntry(editingId) : null;
    const entry = createEntry(form, editingId, existing?.createdAt);

    if (!entry) {
      setStatus(statusEl, 'Add your statement and select at least one distortion.');
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
