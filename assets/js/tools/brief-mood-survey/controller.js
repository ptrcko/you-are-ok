import { buildScoresFromForm, createEntry, deleteEntry, listEntries, loadEntry, saveEntry } from './data.js';
import { getPageElements, loadEntryIntoForm, renderEntries, resetFormState, setStatus } from './ui.js';

// Wires the Brief Mood Survey UI to data operations while keeping state local.
export function initBriefMoodSurvey() {
  const { form, statusEl, entriesContainer, cancelEditButton } = getPageElements();
  let editingId = null;

  function refreshList() {
    const entries = listEntries();
    renderEntries(entriesContainer, entries, {
      onSelect(entry) {
        editingId = entry.id;
        loadEntryIntoForm(form, cancelEditButton, entry);
        setStatus(statusEl, 'Editing existing entry. Saving will update it locally.');
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
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const scores = buildScoresFromForm(form);

    if (!scores) {
      setStatus(statusEl, 'Use numbers between 0 and 4, separated by commas for each field.');
      return;
    }

    const existing = editingId ? loadEntry(editingId) : null;
    const entry = createEntry(scores, editingId, existing?.createdAt);

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
