import { createEntry, deleteEntry, listEntries, loadEntry, saveEntry } from './data.js';
import {
  getPageElements,
  loadEntryIntoForm,
  renderEntries,
  renderItems,
  resetFormState,
  setActiveSide,
  setStatus,
} from './ui.js';

// Orchestrates UI interactions for the Cost–Benefit Analysis tool.
export function initCostBenefitAnalysis() {
  const {
    form,
    statusEl,
    entriesContainer,
    cancelEditButton,
    advantageInput,
    disadvantageInput,
    advantageList,
    disadvantageList,
    sideButtons,
    panels,
    addAdvantageButton,
    addDisadvantageButton,
  } = getPageElements();

  let editingId = null;
  const state = {
    advantages: [],
    disadvantages: [],
    activeSide: 'advantages',
  };

  function refreshEntries() {
    const entries = listEntries();
    renderEntries(entriesContainer, entries, {
      onSelect(entry) {
        editingId = entry.id;
        state.advantages = (entry.advantages || []).map((item) => ({ ...item }));
        state.disadvantages = (entry.disadvantages || []).map((item) => ({ ...item }));
        loadEntryIntoForm(form, cancelEditButton, entry);
        renderItems(advantageList, state.advantages, handleEditItem('advantages'), handleDeleteItem('advantages'));
        renderItems(disadvantageList, state.disadvantages, handleEditItem('disadvantages'), handleDeleteItem('disadvantages'));
        setStatus(statusEl, 'Editing saved entry. Saving will update it locally.');
      },
      onDelete(entry) {
        const confirmed = window.confirm('Delete this entry? This only affects your local data.');
        if (!confirmed) return;
        deleteEntry(entry.id);
        if (editingId === entry.id) {
          editingId = null;
          resetForm();
          setStatus(statusEl, '');
        }
        refreshEntries();
      },
    });
  }

  function resetForm() {
    state.advantages = [];
    state.disadvantages = [];
    renderItems(advantageList, state.advantages, handleEditItem('advantages'), handleDeleteItem('advantages'));
    renderItems(disadvantageList, state.disadvantages, handleEditItem('disadvantages'), handleDeleteItem('disadvantages'));
    setActiveSide(sideButtons, panels, state.activeSide);
    resetFormState(form, cancelEditButton);
  }

  function handleEditItem(side) {
    return (itemId) => {
      const items = side === 'advantages' ? state.advantages : state.disadvantages;
      const target = items.find((item) => item.id === itemId);
      if (!target) return;
      const updated = window.prompt('Update the text', target.text);
      if (!updated) return;
      const next = updated.trim();
      if (!next) return;
      target.text = next;
      renderItems(
        side === 'advantages' ? advantageList : disadvantageList,
        items,
        handleEditItem(side),
        handleDeleteItem(side),
      );
    };
  }

  function handleDeleteItem(side) {
    return (itemId) => {
      const items = side === 'advantages' ? state.advantages : state.disadvantages;
      const filtered = items.filter((item) => item.id !== itemId);
      if (side === 'advantages') {
        state.advantages = filtered;
        renderItems(advantageList, state.advantages, handleEditItem(side), handleDeleteItem(side));
      } else {
        state.disadvantages = filtered;
        renderItems(disadvantageList, state.disadvantages, handleEditItem(side), handleDeleteItem(side));
      }
    };
  }

  function addItem(side) {
    const input = side === 'advantages' ? advantageInput : disadvantageInput;
    const text = input.value.trim();
    if (!text) {
      setStatus(statusEl, 'Add text before adding it to the list.');
      return;
    }
    const items = side === 'advantages' ? state.advantages : state.disadvantages;
    const updatedItems = createEntry.addItem(items, text);
    if (side === 'advantages') {
      state.advantages = updatedItems;
      renderItems(advantageList, state.advantages, handleEditItem(side), handleDeleteItem(side));
    } else {
      state.disadvantages = updatedItems;
      renderItems(disadvantageList, state.disadvantages, handleEditItem(side), handleDeleteItem(side));
    }
    input.value = '';
    setStatus(statusEl, '');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const existing = editingId ? loadEntry(editingId) : null;
    const entry = createEntry.fromForm(
      form,
      state.advantages,
      state.disadvantages,
      editingId,
      existing?.createdAt,
    );

    if (!entry) {
      setStatus(statusEl, 'Include the belief or habit and at least one noted point.');
      return;
    }

    saveEntry(entry);
    setStatus(statusEl, 'Saved locally.');
    editingId = null;
    resetForm();
    refreshEntries();
  }

  function handleCancel() {
    editingId = null;
    resetForm();
    setStatus(statusEl, '');
  }

  function handleSideToggle(event) {
    const side = event.target.dataset.side;
    if (!side) return;
    state.activeSide = side;
    setActiveSide(sideButtons, panels, side);
  }

  sideButtons.forEach((button) => button.addEventListener('click', handleSideToggle));
  addAdvantageButton.addEventListener('click', () => addItem('advantages'));
  addDisadvantageButton.addEventListener('click', () => addItem('disadvantages'));
  form.addEventListener('submit', handleSubmit);
  cancelEditButton.addEventListener('click', handleCancel);

  setActiveSide(sideButtons, panels, state.activeSide);
  refreshEntries();
}
