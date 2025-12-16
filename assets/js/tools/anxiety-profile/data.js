import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'anxiety_profile';
const store = createEntryStore(ENTRY_TYPE);

const EXPERIENCES = [
  {
    id: 'restless-body',
    label: 'Restless energy',
    description: 'Feeling keyed up or unable to settle your body, even when you would prefer to rest.',
  },
  {
    id: 'racing-thoughts',
    label: 'Crowded thoughts',
    description: 'Thoughts moving quickly or looping, making it hard to focus on one thing at a time.',
  },
  {
    id: 'anticipatory-alert',
    label: 'On-guard feeling',
    description: 'Noticing a sense of alertness or dread about what might happen, even without a clear trigger.',
  },
  {
    id: 'body-sensations',
    label: 'Body signals',
    description: 'Physical sensations like a racing heart, tense shoulders, or a tight stomach that show up when worried.',
  },
  {
    id: 'what-if-loop',
    label: 'What-if loops',
    description: 'Spending time imagining possible problems or preparing for many outcomes at once.',
  },
  {
    id: 'checking-urges',
    label: 'Rechecking urges',
    description: 'Wanting to double-check tasks, messages, or plans to feel sure nothing is missed.',
  },
  {
    id: 'avoid-and-delay',
    label: 'Avoiding or delaying',
    description: 'Putting off a task or conversation because thinking about it feels uncomfortable.',
  },
  {
    id: 'sleep-disrupt',
    label: 'Sleep disruptions',
    description: 'Difficulty falling asleep or waking during the night because the mind feels busy.',
  },
  {
    id: 'social-tension',
    label: 'Social tension',
    description: 'Worrying about how you might come across or replaying interactions after they happen.',
  },
  {
    id: 'future-focus',
    label: 'Future scanning',
    description: 'Frequently scanning ahead for risks or responsibilities and feeling on edge while doing so.',
  },
];

export function getExperienceOptions() {
  return EXPERIENCES;
}

function readSelections(form) {
  const checked = Array.from(form.querySelectorAll('input[name="selectedItems"]:checked'));
  return checked.map((input) => input.value);
}

function readNotes(form) {
  const value = form.notes.value.trim();
  return value.length ? value : '';
}

export function createEntry(form, existing) {
  const entry = {
    id: existing?.id || createLocalId(),
    type: ENTRY_TYPE,
    selectedItems: readSelections(form),
    createdAt: existing?.createdAt,
  };

  const notes = readNotes(form);
  if (notes) {
    entry.notes = notes;
  }

  return entry;
}

export function saveEntry(entry) {
  return store.save(entry);
}

export function loadLatestEntry() {
  const entries = store
    .list()
    .filter((entry) => entry.type === ENTRY_TYPE)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  return entries[0] || null;
}

export function deleteEntry(id) {
  return store.remove(id);
}
