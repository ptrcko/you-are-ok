---
layout: default
title: Exposure Log
---

<section class="tool-header">
  <h2>Exposure Log</h2>
  <p class="intro">Record what happened during an exposure session, without judging outcomes.</p>
  <div class="microcopy">
    <p>Saving keeps the entry on this device only.</p>
    <p>No targets, reminders, or streaks are tracked.</p>
  </div>
</section>

<section class="form-first">
  <h2>New exposure session</h2>
  <form id="exposure-form">
    <label for="focus">Exposure focus <span aria-hidden="true">(required)</span></label>
    <textarea id="focus" name="focus" rows="3" required></textarea>
    <p class="hint">What you approached or practiced during this session.</p>

    <label for="sessionDate">Date <span aria-hidden="true">(required)</span></label>
    <input id="sessionDate" name="sessionDate" type="date" required>

    <label for="location">Location or setting (optional)</label>
    <input id="location" name="location" type="text" autocomplete="off">

    <label for="plannedStep">Planned step (optional)</label>
    <textarea id="plannedStep" name="plannedStep" rows="2"></textarea>

    <div class="field-pair">
      <div>
        <label for="startLevel">Starting intensity 0–100 (optional)</label>
        <input id="startLevel" name="startLevel" type="number" inputmode="decimal" min="0" max="100" autocomplete="off">
      </div>
      <div>
        <label for="peakLevel">Peak intensity 0–100 (optional)</label>
        <input id="peakLevel" name="peakLevel" type="number" inputmode="decimal" min="0" max="100" autocomplete="off">
      </div>
    </div>

    <label for="sensations">Sensations or thoughts noticed (optional)</label>
    <textarea id="sensations" name="sensations" rows="3"></textarea>

    <label for="observations">Observations during the session (optional)</label>
    <textarea id="observations" name="observations" rows="3"></textarea>

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
      <li>Save after noting the focus and date. Other fields are optional.</li>
      <li>Editing updates the saved version on this device.</li>
      <li>Deleting removes the entry from your browser’s storage.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved sessions</h2>
  <p class="notice">Entries stay local to your browser.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/exposure-log/index.js' | relative_url }}"></script>
