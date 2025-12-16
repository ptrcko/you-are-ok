import { createEntryStore } from '../../storage.js';
import { createLocalId } from '../shared/ids.js';

const ENTRY_TYPE = 'distortion_log';
const store = createEntryStore(ENTRY_TYPE);

const DISTORTIONS = [
  { code: 'AON', label: 'All-or-Nothing Thinking', description: 'Viewing situations in black-and-white categories without room for middle ground.' },
  { code: 'OG', label: 'Overgeneralization', description: 'Drawing broad conclusions from a single event or limited evidence.' },
  { code: 'MF', label: 'Mental Filter', description: 'Focusing on a single negative detail while ignoring the broader context.' },
  { code: 'DP', label: 'Discounting the Positive', description: 'Rejecting or downplaying positive experiences or feedback.' },
  { code: 'JC', label: 'Jumping to Conclusions', description: 'Assuming outcomes or intentions without clear evidence.' },
  { code: 'MR', label: 'Mind-Reading', description: 'Believing you know what others are thinking without checking.' },
  { code: 'FT', label: 'Fortune-Telling', description: 'Predicting future events as facts without supporting data.' },
  { code: 'MM', label: 'Magnification and Minimization', description: 'Exaggerating negatives or shrinking positives out of proportion.' },
  { code: 'ER', label: 'Emotional Reasoning', description: 'Treating feelings as evidence that something is true.' },
  { code: 'SH', label: 'Should Statements', description: 'Applying rigid rules or expectations to yourself or others.' },
  { code: 'LAB', label: 'Labeling', description: 'Assigning fixed, global labels to yourself or others.' },
  { code: 'BL', label: 'Blame', description: 'Assigning fault without considering complexity or shared factors.' },
  { code: 'SB', label: 'Self-Blame', description: 'Holding yourself solely responsible for events outside your control.' },
  { code: 'OB', label: 'Other-Blame', description: 'Holding others solely responsible without acknowledging any nuance.' },
];

export function getDistortionOptions() {
  return DISTORTIONS;
}

function readSelections(form) {
  const checked = Array.from(form.querySelectorAll('input[name="distortions"]:checked'));
  return checked.map((input) => input.value);
}

function readThought(form) {
  const value = form.thought.value.trim();
  return value.length ? value : null;
}

function readNotes(form) {
  const value = form.notes.value.trim();
  return value.length ? value : '';
}

export function createEntry(form, existingId, createdAt) {
  const thought = readThought(form);
  const distortions = readSelections(form);

  if (!thought || distortions.length === 0) {
    return null;
  }

  const entry = {
    id: existingId || createLocalId(),
    type: ENTRY_TYPE,
    thought,
    distortions,
    createdAt,
  };

  const notes = readNotes(form);
  if (notes) {
    entry.notes = notes;
  }

  return entry;
}

export function listEntries() {
  return store
    .list()
    .filter((entry) => entry.type === ENTRY_TYPE)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveEntry(entry) {
  return store.save(entry);
}

export function deleteEntry(id) {
  return store.remove(id);
}

export function loadEntry(id) {
  return store.get(id);
}
