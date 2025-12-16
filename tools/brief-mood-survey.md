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
    <li><strong>Storage module:</strong> <code>assets/js/storage.js</code> keeps the single data container for the whole app and exposes a typed entry store so tools only read and write their own records.</li>
    <li><strong>Tool module shape:</strong> <code>assets/js/tools/brief-mood-survey/</code> contains a small module per concern (<code>data.js</code> for parsing and persistence, <code>ui.js</code> for rendering, <code>controller.js</code> for event wiring, <code>index.js</code> as the entry point). Copying this folder and swapping the data schema is enough to start a new tool.</li>
    <li><strong>Scalability:</strong> The UI, interaction logic, and storage access are separated so new tools can reuse the pattern without changing global code.</li>
  </ul>
</section>

<script type="module" src="{{ '/assets/js/tools/brief-mood-survey/index.js' | relative_url }}"></script>
