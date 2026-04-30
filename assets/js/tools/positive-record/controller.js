import { createEntry, deleteEntry, formatLongDate, listEntries, randomPastDate, randomReflection, saveEntry } from './data.js';
import { getPageElements, renderEntries, renderVisualizations, setPastDateNote, setPastQuestion, setStatus } from './ui.js';

export function initDailyGoodRecord() {
  const {
    todayOptions,
    pastSection,
    pastQuestion,
    pastDateNote,
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

    renderVisualizations(vizSwitcher, vizPanels, entries);
  }

  function handleTodayAnswer(event) {
    const button = event.target.closest('button[data-answer]');
    if (!button) return;

    todayAnswer = button.dataset.answer;
    selectedPastDate = randomPastDate();
    setPastQuestion(pastQuestion, formatLongDate(selectedPastDate));
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDay = new Date(
      selectedPastDate.getFullYear(),
      selectedPastDate.getMonth(),
      selectedPastDate.getDate(),
    );
    setPastDateNote(pastDateNote, {
      dateText: formatLongDate(selectedPastDate),
      isRememberedLog: selectedDay.getTime() < today.getTime(),
    });
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
