(function () {
  const storageKey = 'you-are-ok-data';
  const appVersion = '0.1.0';

  function createDefaultData() {
    const now = new Date().toISOString();
    return {
      meta: {
        schemaVersion: '1.0.0',
        createdAt: now,
        lastUpdatedAt: now,
        appVersion,
        notes: ''
      },
      profile: {},
      entries: {},
      exercises: {},
      settings: {}
    };
  }

  function ensureRootShape(maybeData) {
    if (!maybeData || typeof maybeData !== 'object') {
      return createDefaultData();
    }

    const root = Object.assign(createDefaultData(), maybeData);
    root.meta = Object.assign(createDefaultData().meta, maybeData.meta || {});
    root.profile = maybeData.profile || {};
    root.entries = maybeData.entries || {};
    root.exercises = maybeData.exercises || {};
    root.settings = maybeData.settings || {};
    return root;
  }

  function saveData(data) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Unable to save data', error);
    }
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        const fresh = createDefaultData();
        saveData(fresh);
        return fresh;
      }
      const parsed = JSON.parse(raw);
      const shaped = ensureRootShape(parsed);
      saveData(shaped);
      return shaped;
    } catch (error) {
      console.error('Unable to load data', error);
      const fallback = createDefaultData();
      saveData(fallback);
      return fallback;
    }
  }

  function renderStatus(data) {
    const dumpEl = document.getElementById('data-dump');
    const statusEl = document.getElementById('data-status');
    if (dumpEl) {
      dumpEl.textContent = JSON.stringify(data, null, 2);
    }
    if (statusEl) {
      const updated = data.meta && data.meta.lastUpdatedAt ? data.meta.lastUpdatedAt : 'not recorded';
      statusEl.textContent = `Data stored locally. Last updated: ${updated}`;
    }
  }

  function wireControls(state) {
    const resetButton = document.getElementById('reset-data');
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        state.data = createDefaultData();
        saveData(state.data);
        renderStatus(state.data);
      });
    }

    const refreshButton = document.getElementById('refresh-view');
    if (refreshButton) {
      refreshButton.addEventListener('click', function () {
        state.data = loadData();
        renderStatus(state.data);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const data = loadData();
    const state = { data };
    renderStatus(state.data);
    wireControls(state);
    window.appState = state;
  });
})();
