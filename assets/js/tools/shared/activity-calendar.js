import { loadData } from '../../storage.js';

function dayKey(value) { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }

export function getActivityByDay() {
  const entries = Object.values(loadData().entries).filter((entry) => !entry.deleted);
  return entries.reduce((acc, entry) => {
    const when = entry.updatedAt || entry.createdAt;
    if (!when) return acc;
    const key = dayKey(when);
    const day = acc.get(key) || { total: 0, types: {} };
    day.total += 1;
    day.types[entry.type] = (day.types[entry.type] || 0) + 1;
    acc.set(key, day);
    return acc;
  }, new Map());
}

export function renderGlobalCalendar(root) {
  if (!root) return;
  const days = getActivityByDay();
  const rows = Array.from(days.entries()).sort((a,b)=>a[0]<b[0]?1:-1).slice(0,30);
  if (!rows.length) { root.innerHTML = '<p>No recorded activity yet.</p>'; return; }
  root.innerHTML = `<ul class="entry-list">${rows.map(([date,val])=>`<li class="entry-card"><p class="entry-title">${date} · ${val.total} entr${val.total===1?'y':'ies'}</p><p>${Object.entries(val.types).map(([t,c])=>`${t}: ${c}`).join(' · ')}</p></li>`).join('')}</ul>`;
}
