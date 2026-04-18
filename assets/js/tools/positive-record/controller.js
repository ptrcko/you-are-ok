import { createEntry, deleteEntry, formatLongDate, listEntries, randomPastDate, randomReflection, saveEntry } from './data.js';
import { getPageElements, renderEntries, setPastQuestion, setStatus } from './ui.js';

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
  } = getPageElements();

  let todayAnswer = null;
  let selectedPastDate = null;

  function resetFlow() {
    todayAnswer = null;
    selectedPastDate = null;
    pastSection.hidden = true;
  }

  function refreshEntries() {
    renderEntries(entriesContainer, listEntries(), {
      onDelete(entry) {
        const confirmed = window.confirm('Delete this check-in from this device?');
        if (!confirmed) return;
        deleteEntry(entry.id);
        setStatus(statusEl, 'Deleted.');
        refreshEntries();
      },
    });
  }

  function handleTodayAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button) return;

    todayAnswer = button.dataset.answer;
    selectedPastDate = randomPastDate();
    setPastQuestion(pastQuestion, formatLongDate(selectedPastDate));
    pastSection.hidden = false;
    reflectionSection.hidden = true;
    setStatus(statusEl, '');
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
