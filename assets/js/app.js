import { getLastActivity } from './storage.js';
import { humanizeEntryType, renderGlobalCalendar } from './tools/shared/activity-calendar.js';
const TOOL_STORAGE_KEY = 'you-are-ok:tool-usage';

const TOOLS = [
  { path: '/tools/brief-mood-survey/', name: 'Brief Mood Survey', description: 'Quick snapshot of current emotional state.' },
  { path: '/tools/thought-record/', name: 'Thought Record', description: 'Capture a distressing thought and context.' },
  { path: '/tools/catastrophising-check-in/', name: 'Catastrophising Check-In', description: 'Review future-focused worries with evidence.' },
  { path: '/tools/story/', name: 'Story', description: 'Write freely in a calm, non-judgmental space.' },
  { path: '/tools/cognitive-distortion-identification/', name: 'Cognitive Distortion Identification', description: 'Identify potential distortion patterns.' },
  { path: '/tools/cognitive-distortions/', name: 'Cognitive Distortions Log', description: 'Log thoughts with optional distortion markers.' },
  { path: '/tools/cost-benefit-analysis/', name: 'Cost–Benefit Analysis', description: 'Compare practical upsides and downsides.' },
  { path: '/tools/paradoxical-cost-benefit-analysis/', name: 'Paradoxical Cost–Benefit Analysis', description: 'Explore reasons for holding onto habits.' },
  { path: '/tools/positive-record/', name: 'Daily Good Record', description: 'Short check-in for what went well.' },
  { path: '/tools/anxiety-profile/', name: 'Anxiety Profile', description: 'Self-reflection checklist of anxiety experiences.' },
  { path: '/tools/fear-hierarchy/', name: 'Fear Hierarchy', description: 'Organize feared situations by intensity.' },
  { path: '/tools/exposure-log/', name: 'Exposure Log', description: 'Track observations from exposures.' },
  { path: '/tools/phobia-log/', name: 'Phobia Log', description: 'Summarize one exposure attempt.' },
  { path: '/tools/relapse-awareness-log/', name: 'Relapse Awareness Log', description: 'Document setbacks and helpful responses.' },
  { path: '/tools/sample-data/', name: 'Sample Data', description: 'Add or clear recent sample entries for all tools.' },
];

function normalize(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

function loadUsage() {
  try {
    return JSON.parse(localStorage.getItem(TOOL_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsage(data) {
  localStorage.setItem(TOOL_STORAGE_KEY, JSON.stringify(data));
}

function trackToolVisit() {
  const usage = loadUsage();
  const path = normalize(window.location.pathname);
  const tool = TOOLS.find((item) => item.path === path);
  if (!tool) return;

  const current = usage[path] || { count: 0, lastUsedAt: null };
  usage[path] = { count: current.count + 1, lastUsedAt: new Date().toISOString() };
  saveUsage(usage);
}

function renderTools() {
  const allRoot = document.querySelector('#all-tools');
  if (!allRoot) return;

  const usage = loadUsage();
  const decorate = (tool) => ({ ...tool, count: usage[tool.path]?.count || 0, lastUsedAt: usage[tool.path]?.lastUsedAt || null });
  const all = TOOLS.map(decorate);
  const most = [...all].filter((item) => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 6);
  const recent = [...all].filter((item) => item.lastUsedAt).sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt)).slice(0, 6);

  renderList(document.querySelector('#most-used-tools'), most, 'Use tools to build your local ranking.');
  renderList(document.querySelector('#recent-tools'), recent, 'Your recently opened tools appear here.');
  renderList(allRoot, all, '');
}


function renderLastActive() {
  const root = document.querySelector('#last-active-note');
  if (!root) return;
  const last = getLastActivity();
  if (!last) { root.textContent = 'Latest activity: no entries yet.'; return; }
  root.textContent = `Latest activity: ${humanizeEntryType(last.entryType)} — ${last.action} at ${new Date(last.occurredAt).toLocaleString()}`;
}

function renderActivityCalendar() {
  renderGlobalCalendar(document.querySelector('#global-activity-calendar'));
}

function renderList(root, items, emptyText) {
  if (!root) return;
  root.innerHTML = '';

  if (!items.length) {
    if (emptyText) {
      const p = document.createElement('p');
      p.textContent = emptyText;
      root.appendChild(p);
    }
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<a class="summary-card" href="${item.path}"><h3>${item.name}</h3><p>${item.description}</p></a>`;
    root.appendChild(li);
  });
}

export function initMenu() {
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  if (!button || !menu) return;

  const setMenuState = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body?.classList?.toggle('menu-open', open);
  };

  const focusFirstMenuLink = () => {
    const firstLink = menu.querySelector('a');
    firstLink?.focus?.();
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;
    setMenuState(false);
    if (returnFocus) button.focus?.();
  };

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    const nextOpen = !isOpen;
    setMenuState(nextOpen);
    if (nextOpen) focusFirstMenuLink();
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('a')) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu({ returnFocus: true });
    }
  });

  document.addEventListener('click', (event) => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (button.contains(target) || menu.contains(target)) return;
    closeMenu({ returnFocus: true });
  });
}

export function initApp() {
  trackToolVisit();
  initMenu();
  renderTools();
  renderLastActive();
  renderActivityCalendar();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
  initApp();
}
