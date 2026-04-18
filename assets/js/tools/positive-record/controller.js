import {
  createPastEntry,
  createTodayEntry,
  deleteEntry,
  formatLongDate,
  listEntries,
  randomPastDate,
  randomReflection,
  saveEntry,
} from './data.js';
import { getPageElements, renderEntries, renderVisualizations, setPastQuestion, setStatus } from './ui.js';

export function initDailyGoodRecord() {
  const {
    todayOptions,
    pastSection,
    pastQuestion,
    pastOptions,
    reflectionSection,
    reflectionText,
    statusEl,
    entriesContainer,
    vizSwitcher,
    vizPanels,
  } = getPageElements();

  let todayAnswer = null;
  let selectedPastDate = null;

  function resetFlow() {
    todayAnswer = null;
    selectedPastDate = null;
    pastSection.hidden = true;
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

    renderVisualizations(vizSwitcher, vizPanels, entries);
  }

  function handleTodayAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button) return;

    todayAnswer = button.dataset.answer;
    saveEntry(createTodayEntry(todayAnswer));
    selectedPastDate = randomPastDate();
    setPastQuestion(pastQuestion, formatLongDate(selectedPastDate));
    pastSection.hidden = false;
    reflectionSection.hidden = true;
    setStatus(statusEl, 'Saved today’s check-in locally.');
    refreshEntries();
  }

  function handlePastAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button || !todayAnswer || !selectedPastDate) return;

    const pastAnswer = button.dataset.answer;
    const pastDate = formatLongDate(selectedPastDate);

    const entry = createPastEntry({
      pastAnswer,
      pastDate,
    });

    saveEntry(entry);
    reflectionText.textContent = randomReflection();
    reflectionSection.hidden = false;
    setStatus(statusEl, 'Saved background-day check-in locally.');

    resetFlow();
    refreshEntries();
  }

  todayOptions.addEventListener('click', handleTodayAnswer);
  pastOptions.addEventListener('click', handlePastAnswer);

  refreshEntries();
}
