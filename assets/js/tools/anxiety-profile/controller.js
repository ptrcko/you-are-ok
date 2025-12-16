import { createEntry, deleteEntry, getExperienceOptions, loadLatestEntry, saveEntry } from './data.js';
import {
  getPageElements,
  loadEntryIntoForm,
  renderExperienceChecklist,
  renderSavedSelection,
  resetFormState,
  setStatus,
} from './ui.js';

export function initAnxietyProfile() {
  const { form, statusEl, resetButton, checklistContainer, savedContainer } = getPageElements();
  const options = getExperienceOptions();

  renderExperienceChecklist(checklistContainer, options);

  function refreshSaved() {
    const saved = loadLatestEntry();
    renderSavedSelection(savedContainer, saved, options, {
      onLoad(entry) {
        loadEntryIntoForm(form, entry, options);
        setStatus(statusEl, 'Loaded your saved selection into the form.');
      },
      onDelete(entry) {
        const confirmed = window.confirm('Remove the saved selection? This only affects data on this device.');
        if (!confirmed) return;
        deleteEntry(entry.id);
        resetFormState(form);
        setStatus(statusEl, 'Saved selection removed.');
        refreshSaved();
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const existing = loadLatestEntry();
    const entry = createEntry(form, existing);
    saveEntry(entry);
    setStatus(statusEl, 'Saved locally. You can reopen or clear this selection at any time.');
    refreshSaved();
  }

  function handleReset() {
    resetFormState(form);
    setStatus(statusEl, 'Form cleared. Saved selection stays unchanged.');
  }

  form.addEventListener('submit', handleSubmit);
  resetButton.addEventListener('click', handleReset);

  refreshSaved();
}
