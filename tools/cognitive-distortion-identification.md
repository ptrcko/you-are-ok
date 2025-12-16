---
layout: default
title: Cognitive Distortion Identification
---

<section class="tool-header">
  <h2>Cognitive Distortion Identification</h2>
  <p class="intro">Pair your own words with distortion definitions to notice patterns in thinking.</p>
  <div class="microcopy">
    <p>Selections are saved locally and can be edited or deleted.</p>
    <p>The checklist is descriptive only—no scores or interpretations.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="identification-form">
    <label for="statement">Thought or statement <span aria-hidden="true">(required)</span></label>
    <textarea id="statement" name="statement" rows="4" required></textarea>
    <p class="hint">Use your own words. You can keep it brief.</p>

    <fieldset>
      <legend>Cognitive distortions</legend>
      <p class="hint">Choose any that fit. Definitions are shown for reference.</p>
      <div id="distortion-checklist"></div>
    </fieldset>

    <label for="reflections">Notes or reflections (optional)</label>
    <textarea id="reflections" name="reflections" rows="3"></textarea>

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
      <li>Enter your statement and select at least one distortion.</li>
      <li>Edit or delete saved entries; changes stay on this device.</li>
      <li>No comparisons, streaks, or reminders are created.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Everything you save remains in your browser’s storage only.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/cognitive-distortion-identification/index.js' | relative_url }}"></script>
