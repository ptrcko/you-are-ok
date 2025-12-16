// UI helpers for the Anxiety Profile tool. DOM-only with no storage access.
export function getPageElements() {
  return {
    form: document.querySelector('#anxiety-profile-form'),
    statusEl: document.querySelector('#form-status'),
    resetButton: document.querySelector('#reset-form'),
    checklistContainer: document.querySelector('#anxiety-checklist'),
    savedContainer: document.querySelector('#saved-selection'),
  };
}

export function setStatus(statusEl, message) {
  statusEl.textContent = message;
}

export function resetFormState(form) {
  form.reset();
}

export function loadEntryIntoForm(form, entry, options) {
  resetFormState(form);
  form.notes.value = entry.notes || '';

  const codes = new Set(entry.selectedItems || []);
  options.forEach((experience) => {
    const checkbox = form.querySelector(`input[name="selectedItems"][value="${experience.id}"]`);
    if (checkbox) {
      checkbox.checked = codes.has(experience.id);
    }
  });
}

export function renderExperienceChecklist(container, options) {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'checklist';

  options.forEach((experience) => {
    const item = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'checkbox-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'selectedItems';
    checkbox.value = experience.id;

    const text = document.createElement('div');
    const title = document.createElement('span');
    title.className = 'checkbox-title';
    title.textContent = experience.label;

    const description = document.createElement('p');
    description.className = 'hint';
    description.textContent = experience.description;

    text.appendChild(title);
    text.appendChild(description);

    label.appendChild(checkbox);
    label.appendChild(text);
    item.appendChild(label);
    list.appendChild(item);
  });

  container.appendChild(list);
}

function mapIdsToLabels(ids, options) {
  const map = new Map(options.map((item) => [item.id, item.label]));
  return ids.map((id) => map.get(id) || id);
}

function buildSelectionDetails(entry, options) {
  const wrapper = document.createElement('div');
  wrapper.className = 'entry-details';

  const summary = document.createElement('p');
  summary.className = 'hint';
  summary.textContent = 'This is a saved reflection for your own awareness.';
  wrapper.appendChild(summary);

  const list = document.createElement('dl');

  const chosen = mapIdsToLabels(entry.selectedItems || [], options);
  const chosenText = chosen.length ? chosen.join(', ') : 'No items selected';
  const dtSelections = document.createElement('dt');
  dtSelections.textContent = 'Selected experiences';
  const ddSelections = document.createElement('dd');
  ddSelections.textContent = chosenText;
  list.appendChild(dtSelections);
  list.appendChild(ddSelections);

  if (entry.notes) {
    const dtNotes = document.createElement('dt');
    dtNotes.textContent = 'Notes';
    const ddNotes = document.createElement('dd');
    ddNotes.textContent = entry.notes;
    list.appendChild(dtNotes);
    list.appendChild(ddNotes);
  }

  wrapper.appendChild(list);
  return wrapper;
}

export function renderSavedSelection(container, entry, options, { onLoad, onDelete }) {
  container.innerHTML = '';

  if (!entry) {
    const empty = document.createElement('p');
    empty.textContent = 'No selection saved yet.';
    container.appendChild(empty);
    return;
  }

  const card = document.createElement('div');
  card.className = 'entry-card';

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const loadButton = document.createElement('button');
  loadButton.type = 'button';
  loadButton.textContent = 'Load into form';
  loadButton.addEventListener('click', () => onLoad(entry));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'secondary';
  deleteButton.textContent = 'Delete saved selection';
  deleteButton.addEventListener('click', () => onDelete(entry));

  actions.appendChild(loadButton);
  actions.appendChild(deleteButton);

  card.appendChild(actions);
  card.appendChild(buildSelectionDetails(entry, options));

  container.appendChild(card);
}
