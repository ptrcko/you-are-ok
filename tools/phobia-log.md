---
layout: default
title: Phobia Log
---

<section class="tool-header">
  <h2>Phobia Log</h2>
  <p class="intro">Capture one exposure session with start and end feelings noted side by side.</p>
  <div class="microcopy">
    <p>No scores or streaks are calculated.</p>
    <p>Entries live only in your browser.</p>
  </div>
</section>

<section class="form-first">
  <h2>New session</h2>
  <form id="phobia-form">
    <label for="exposureType">Type of exposure</label>
    <input id="exposureType" name="exposureType" type="text" required />

    <label for="sessionDate">Date</label>
    <input id="sessionDate" name="sessionDate" type="date" required />

    <label for="timeSpent">Time spent</label>
    <input id="timeSpent" name="timeSpent" type="text" placeholder="Example: 20 minutes" required />

    <div class="grid-two-columns">
      <div>
        <label for="anxietyStart">Anxiety at start (0–100%)</label>
        <input id="anxietyStart" name="anxietyStart" type="number" min="0" max="100" inputmode="decimal" required />
      </div>
      <div>
        <label for="anxietyEnd">Anxiety at end (0–100%)</label>
        <input id="anxietyEnd" name="anxietyEnd" type="number" min="0" max="100" inputmode="decimal" required />
      </div>
    </div>

    <label for="thoughts">Frightening thoughts and fantasies (optional)</label>
    <textarea id="thoughts" name="thoughts" rows="3"></textarea>

    <div class="form-actions">
      <button type="submit">Save locally</button>
      <button type="button" id="cancel-edit" class="secondary" hidden>Cancel edit</button>
      <p id="form-status" class="form-status" aria-live="polite"></p>
    </div>
  </form>
</section>

<section class="supporting">
  <details class="collapsible" aria-label="How this page works">
    <summary>How this page works</summary>
    <ul>
      <li>Record the session type, date, and how long you spent.</li>
      <li>Note anxiety at the start and end using a 0–100% range.</li>
      <li>Save to keep the entry on this device. You can reopen, edit, or delete it later.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved sessions</h2>
  <p class="notice">Data remains local to this browser. Removing a session only changes your device.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/phobia-log/index.js' | relative_url }}"></script>
