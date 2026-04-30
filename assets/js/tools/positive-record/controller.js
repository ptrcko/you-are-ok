import { createEntry, deleteEntry, formatLongDate, listEntries, randomReflection, saveEntry } from './data.js';
import {
  getPageElements,
  renderEntries,
  renderReviewDate,
  renderVisualizations,
  setPastDateNote,
  setPastQuestion,
  setStatus,
} from './ui.js';

export function initDailyGoodRecord() {
  const {
    todayOptions,
    pastSection,
    pastQuestion,
    pastDateNote,
    pastOptions,
    reflectionSection,
    reviewDateEl,
    reflectionText,
    statusEl,
    entriesContainer,
    vizPanels,
  } = getPageElements();

  let todayAnswer = null;
  let selectedPastDate = null;
  let calendarOffsetBlocks = 0;

  function resetFlow() {
    todayAnswer = null;
    selectedPastDate = null;
    pastSection.hidden = true;
    if (pastDateNote) pastDateNote.hidden = true;
  }

  function refreshEntries() {
    const entries = listEntries();

    renderEntries(entriesContainer, entries, {
      onDelete(entry) {
        const confirmed = window.confirm('Delete this check-in from this device?');
        if (!confirmed) return;
        deleteEntry(entry.id);
        setStatus(statusEl, 'Deleted.');
        refreshEntries();
      },
    });

    renderVisualizations(vizPanels, entries, {
      offsetBlocks: calendarOffsetBlocks,
      onSelectDate(date) {
        selectedPastDate = date;
        const formattedPastDate = formatLongDate(selectedPastDate);
        setPastQuestion(pastQuestion, formattedPastDate);
        setPastDateNote(pastDateNote, {
          dateText: formattedPastDate,
          isRememberedLog: true,
        });
        pastSection.hidden = false;
      },
      onNavigate(direction) {
        calendarOffsetBlocks += direction;
        if (calendarOffsetBlocks < 0) calendarOffsetBlocks = 0;
        refreshEntries();
      },
      onResetView() {
        calendarOffsetBlocks = 0;
        refreshEntries();
      },
    });
  }

  function handleTodayAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button) return;

    todayAnswer = button.dataset.answer;
    reflectionSection.hidden = true;
    setStatus(statusEl, 'Select a missed date from the calendar below.');
  }

  function handlePastAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button || !todayAnswer || !selectedPastDate) return;

    const pastAnswer = button.dataset.answer;
    const pastDate = formatLongDate(selectedPastDate);

    const entry = createEntry({
      todayAnswer,
      pastAnswer,
      pastDate,
    });

    saveEntry(entry);
    renderReviewDate(reviewDateEl, pastDate, entry.entry_type === 'remembered');
    reflectionText.textContent = randomReflection();
    reflectionSection.hidden = false;
    setStatus(statusEl, 'Saved locally.');

    resetFlow();
    refreshEntries();
  }

  todayOptions.addEventListener('click', handleTodayAnswer);
  pastOptions.addEventListener('click', handlePastAnswer);

  refreshEntries();
}
