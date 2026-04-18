function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatAnswer(value) {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  if (value === 'i_dont_remember') return 'I don’t remember';
  return value;
}

export function getPageElements() {
  return {
    todayOptions: document.querySelector('#today-options'),
    pastSection: document.querySelector('#past-section'),
    pastQuestion: document.querySelector('#past-question'),
    pastOptions: document.querySelector('#past-options'),
    reflectionSection: document.querySelector('#reflection-section'),
    reflectionText: document.querySelector('#reflection-text'),
    statusEl: document.querySelector('#form-status'),
    entriesContainer: document.querySelector('#entries'),
  };
}

export function setPastQuestion(pastQuestionEl, dateText) {
  pastQuestionEl.textContent = `Thinking back to ${dateText}, did anything bad happen that day?`;
}

export function setStatus(statusEl, message) {
  statusEl.textContent = message;
}

export function renderEntries(container, entries, { onDelete }) {
  container.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No check-ins saved yet.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'entry-list';

  entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'entry-card';

    const header = document.createElement('div');
    header.className = 'entry-header';

    const title = document.createElement('p');
    title.className = 'entry-title';
    title.textContent = `Recorded ${formatTimestamp(entry.createdAt || entry.updatedAt)}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => onDelete(entry));

    header.append(title, deleteButton);

    const details = document.createElement('dl');
    details.className = 'entry-details';

    const rows = [
      ['Today', formatAnswer(entry.today_answer)],
      [entry.past_date ? `Past day (${entry.past_date})` : 'Past day', formatAnswer(entry.past_answer)],
    ];

    rows.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      details.append(dt, dd);
    });

    item.append(header, details);
    list.appendChild(item);
  });

  container.appendChild(list);
}
