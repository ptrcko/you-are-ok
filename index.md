---
layout: default
title: Home
---

<section>
  <h2>Welcome</h2>
  <p>This site is a structured private notebook. Everything stays on your device and is meant to be calm, direct, and free of external dependencies.</p>
  <p class="status-note">You can leave fields empty. There are no prompts, alerts, or timers.</p>
</section>

<section>
  <h2>Data foundation</h2>
  <p>The app creates a single root data object that follows the shared schema. It is saved locally and reused when you return.</p>
  <div class="button-row">
    <button type="button" id="reset-data">Reset to fresh data</button>
    <button type="button" id="refresh-view">Refresh view</button>
  </div>
  <p class="status-note" id="data-status" aria-live="polite"></p>
  <h3>Current stored object</h3>
  <pre id="data-dump" aria-live="polite"></pre>
</section>

<section>
  <h2>Upcoming exercises</h2>
  <p>Exercises will appear here after the foundational storage and state layers are in place. There are no scores or interpretations, only structured entries that you control.</p>
</section>
