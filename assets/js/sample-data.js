import { loadData, saveData } from './storage.js';

const ENTRY_TYPES = [
  'mood_survey',
  'thought_record',
  'catastrophising_check_in',
  'story',
  'distortion_identification',
  'distortion_log',
  'cost_benefit',
  'daily_good_record',
  'anxiety_profile',
  'exposure_log',
  'relapse_awareness',
];

function daysAgoIso(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString();
}

function sampleEntries() {
  return [
    { id: 'sample-mood-1', type: 'mood_survey', scores: { anxiety_feelings: [1, 2, 1], anxiety_physical: [2, 1, 1], depression: [1, 1, 0, 1, 1], suicidal_urges: [0] }, totals: { anxiety_feelings: 4, anxiety_physical: 4, depression: 4, suicidal_urges: 0 }, createdAt: daysAgoIso(2), updatedAt: daysAgoIso(2), deleted: false },
    { id: 'sample-thought-1', type: 'thought_record', situation: 'I got a short email reply from my manager.', automaticThought: 'I must have done something wrong.', feelings: 'Anxious, embarrassed.', supportingEvidence: 'Reply was brief.', contradictingEvidence: 'No criticism was given and deadlines are on track.', balancedResponse: 'A short reply can just mean they are busy.', createdAt: daysAgoIso(3), updatedAt: daysAgoIso(3), deleted: false },
    { id: 'sample-cat-1', type: 'catastrophising_check_in', scenario: 'If I stumble in the presentation, everyone will lose confidence in me.', fearedOutcome: 'I will be seen as incompetent.', likelihood: '35', copingPlan: 'Pause, breathe, and continue with my notes.', bestOutcome: 'People focus on the useful content.', createdAt: daysAgoIso(5), updatedAt: daysAgoIso(5), deleted: false },
    { id: 'sample-story-1', type: 'story', title: 'Evening reflection', text: 'Today felt heavy at first, but I took a short walk and things softened.', createdAt: daysAgoIso(6), updatedAt: daysAgoIso(6), deleted: false },
    { id: 'sample-distortion-id-1', type: 'distortion_identification', thought: 'If I make one mistake, the whole day is ruined.', selectedDistortions: ['all-or-nothing', 'fortune-telling'], notes: 'I notice this pattern when tired.', createdAt: daysAgoIso(7), updatedAt: daysAgoIso(7), deleted: false },
    { id: 'sample-distortion-log-1', type: 'distortion_log', situation: 'A friend did not reply for a few hours.', thought: 'They are upset with me.', distortions: ['mind-reading'], reframedThought: 'They are probably busy; I can check in later.', createdAt: daysAgoIso(9), updatedAt: daysAgoIso(9), deleted: false },
    { id: 'sample-cba-1', type: 'cost_benefit', topic: 'Staying up late scrolling', benefits: 'Temporary distraction.', costs: 'Poor sleep and low energy next day.', alternative: 'Read for 10 minutes then sleep.', createdAt: daysAgoIso(10), updatedAt: daysAgoIso(10), deleted: false },
    { id: 'sample-good-1', type: 'daily_good_record', item: 'I cooked dinner instead of ordering takeaway.', gratitude: 'I appreciate having food ready at home.', createdAt: daysAgoIso(12), updatedAt: daysAgoIso(12), deleted: false },
    { id: 'sample-anxiety-1', type: 'anxiety_profile', symptoms: ['worry', 'muscle-tension', 'restlessness'], intensity: 'moderate', notes: 'More noticeable before meetings.', createdAt: daysAgoIso(14), updatedAt: daysAgoIso(14), deleted: false },
    { id: 'sample-exposure-1', type: 'exposure_log', exposureTask: 'Take elevator one floor', fearBefore: '6', fearAfter: '3', learning: 'Anxiety dropped within a minute.', createdAt: daysAgoIso(16), updatedAt: daysAgoIso(16), deleted: false },
    { id: 'sample-relapse-1', type: 'relapse_awareness', setback: 'Skipped my planned evening routine.', trigger: 'Felt drained after work.', responsePlan: 'Restart with a shorter routine tomorrow.', createdAt: daysAgoIso(18), updatedAt: daysAgoIso(18), deleted: false },
  ];
}

function setMessage(text, isError = false) {
  const message = document.querySelector('#sample-data-message');
  if (!message) return;
  message.textContent = text;
  message.style.color = isError ? '#b00020' : 'inherit';
}

function addSampleData() {
  const data = loadData();
  const entries = { ...data.entries };

  sampleEntries().forEach((entry) => {
    entries[entry.id] = entry;
  });

  const next = {
    ...data,
    entries,
    meta: {
      ...data.meta,
      lastActivity: {
        entryId: 'sample-relapse-1',
        entryType: 'relapse_awareness',
        action: 'created',
        occurredAt: daysAgoIso(1),
        summary: 'Sample data added',
      },
    },
  };

  saveData(next);
  setMessage(`Added sample data for ${ENTRY_TYPES.length} tools.`);
}

function clearSampleData() {
  const data = loadData();
  const entries = Object.fromEntries(Object.entries(data.entries).filter(([, entry]) => !String(entry.id || '').startsWith('sample-')));

  const next = { ...data, entries };
  saveData(next);
  setMessage('Sample data cleared.');
}

function init() {
  const addButton = document.querySelector('#add-sample-data');
  const clearButton = document.querySelector('#clear-sample-data');
  if (!addButton || !clearButton) return;

  addButton.addEventListener('click', addSampleData);
  clearButton.addEventListener('click', clearSampleData);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  init();
}
