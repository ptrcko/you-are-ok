import {
  createEntry,
  deleteEntry,
  formatLongDate,
  listEntries,
  randomPastDate,
  randomReflection,
  saveEntry,
} from './data.js';
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
    todaySection,
    todayOptions,
    pastSection,
    pastQuestion,
    pastDateNote,
    backfillCancel,
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
  let flowMode = 'two_step';

  function resetFlow() {
    flowMode = 'two_step';
    todayAnswer = null;
    selectedPastDate = null;
    if (todaySection) todaySection.hidden = false;
    pastSection.hidden = true;
    if (backfillCancel) backfillCancel.hidden = true;
    if (pastDateNote) pastDateNote.hidden = true;
  }

  function showPastSection(date, { backfill = false } = {}) {
    selectedPastDate = date;
    flowMode = backfill ? 'backfill' : 'two_step';
    if (todaySection) todaySection.hidden = backfill;
    if (backfillCancel) backfillCancel.hidden = !backfill;
    const formattedPastDate = formatLongDate(selectedPastDate);
    setPastQuestion(pastQuestion, formattedPastDate);
    setPastDateNote(pastDateNote, {
      dateText: formattedPastDate,
      isRememberedLog: true,
    });
    pastSection.hidden = false;
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
        showPastSection(date, { backfill: true });
        setStatus(statusEl, 'Backfill mode: answer this past day to save immediately.');
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

    showPastSection(randomPastDate(), { backfill: false });

    setStatus(statusEl, 'Answer this suggested past day, or pick a missed date from the calendar below.');
  }

  function handlePastAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button || !selectedPastDate) return;

    const requiresTodayAnswer = flowMode === 'two_step';
    if (requiresTodayAnswer && !todayAnswer) return;

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
  backfillCancel?.addEventListener('click', () => {
    resetFlow();
    setStatus(statusEl, 'Backfill canceled.');
  });

  refreshEntries();
}
