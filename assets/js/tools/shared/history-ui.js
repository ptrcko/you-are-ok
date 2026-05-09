export function formatTimestamp(value) { if (!value) return ''; const date = new Date(value); return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; }

export function renderHistoryEntries(container, entries, { emptyText, toTitle, toFields, onSelect, onDelete }) {
  container.innerHTML = '';
  if (!entries.length) { const empty = document.createElement('p'); empty.textContent = emptyText; container.appendChild(empty); return; }
  const list = document.createElement('ul'); list.className = 'entry-list';
  entries.forEach((entry) => {
    const item = document.createElement('li'); item.className = 'entry-card';
    const header = document.createElement('div'); header.className = 'entry-header';
    const title = document.createElement('p'); title.className = 'entry-title'; title.textContent = toTitle(entry); header.appendChild(title);
    const actions = document.createElement('div'); actions.className = 'entry-actions';
    if (onSelect) { const open = document.createElement('button'); open.type = 'button'; open.textContent = 'Open'; open.addEventListener('click', () => onSelect(entry)); actions.appendChild(open); }
    const del = document.createElement('button'); del.type = 'button'; del.className = 'secondary'; del.textContent = 'Delete'; del.addEventListener('click', () => onDelete(entry)); actions.appendChild(del);
    header.appendChild(actions); item.appendChild(header);
    const details = document.createElement('dl'); details.className = 'entry-details';
    toFields(entry).forEach(([label, value]) => { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; details.append(dt, dd); });
    item.appendChild(details); list.appendChild(item);
  });
  container.appendChild(list);
}
