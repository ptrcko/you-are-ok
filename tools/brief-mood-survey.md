---
layout: default
title: Brief Mood Survey
---

<section>
  <h2>Brief Mood Survey</h2>
  <p>This tool offers a simple snapshot of current emotional states across a few dimensions.</p>
  <p class="notice">Purpose: track feelings in the moment without interpretation, scoring, or comparison.</p>
</section>

<section>
  <h2>How to record a check-in</h2>
  <ul>
    <li>Use numbers between 0 and 4 for each row.</li>
    <li>Separate multiple scores with commas to keep the raw values.</li>
    <li>Totals are stored alongside the raw scores for transparency.</li>
    <li>No interpretation, alerts, or comparisons are applied.</li>
  </ul>
</section>

<section>
  <h2>New entry</h2>
  <form id="mood-form">
    <fieldset>
      <legend>Raw scores (0–4 scale)</legend>
      <label for="anxietyFeelings">Anxiety (feelings)</label>
      <input id="anxietyFeelings" name="anxietyFeelings" type="text" inputmode="decimal" autocomplete="off" required>
      <p class="hint">Example: 1, 0, 2. Values are stored exactly as typed.</p>

      <label for="anxietyPhysical">Anxiety (physical)</label>
      <input id="anxietyPhysical" name="anxietyPhysical" type="text" inputmode="decimal" autocomplete="off" required>
      <p class="hint">Example: 0, 1. Use commas to record multiple scores.</p>

      <label for="depression">Depression</label>
      <input id="depression" name="depression" type="text" inputmode="decimal" autocomplete="off" required>
      <p class="hint">Numbers only. No ranges beyond 0–4.</p>

      <label for="suicidalUrges">Suicidal urges</label>
      <input id="suicidalUrges" name="suicidalUrges" type="text" inputmode="decimal" autocomplete="off" required>
      <p class="hint">Keep the same 0–4 scale. This field is stored without interpretation.</p>
    </fieldset>

    <div class="form-actions">
      <button type="submit">Save locally</button>
      <button type="button" id="cancel-edit" class="secondary" hidden>Cancel edit</button>
      <p id="form-status" class="form-status" aria-live="polite"></p>
    </div>
  </form>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Entries stay on this device. Refreshing the page will keep them available.</p>
  <div id="entries"></div>
</section>

<section>
  <h2>Implementation notes</h2>
  <ul>
    <li><strong>Storage module:</strong> <code>assets/js/storage.js</code> is a single, inspectable layer that keeps the shared data container, applies schema metadata, and saves entries to <code>localStorage</code> on explicit actions only.</li>
    <li><strong>Interaction module:</strong> <code>assets/js/brief-mood-survey.js</code> handles parsing inputs, calculating totals, and rendering the list without touching storage directly.</li>
    <li><strong>Scalability:</strong> Each tool can reuse the storage module and add its own interaction file, keeping UI, state changes, and persistence clearly separated.</li>
  </ul>
</section>

<script type="module" src="{{ '/assets/js/brief-mood-survey.js' | relative_url }}"></script>
