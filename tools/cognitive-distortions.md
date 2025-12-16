---
layout: default
title: Cognitive Distortions Log
---

<section>
  <h2>Cognitive Distortions Log</h2>
  <p>This tool mirrors Dr. David Burns’ Checklist of Cognitive Distortions to notice patterns in a specific thought.</p>
  <p class="notice">Purpose: record a thought, mark any distortions that may fit, and keep notes for later awareness. No scoring or fixes are provided.</p>
</section>

<section>
  <h2>How to use this page</h2>
  <ul>
    <li>Write the thought in your own words.</li>
    <li>Select one or more distortions from the checklist. The list is read-only reference text.</li>
    <li>Optionally add notes or reflections.</li>
    <li>Save to keep the entry on this device. You can reopen, edit, or delete it later.</li>
  </ul>
</section>

<section>
  <h2>New entry</h2>
  <form id="distortion-form">
    <label for="thought">Thought</label>
    <textarea id="thought" name="thought" rows="4" required></textarea>
    <p class="hint">Free text. Nothing here is interpreted, scored, or shared.</p>

    <fieldset>
      <legend>Cognitive distortions checklist</legend>
      <p class="hint">Select all that seem relevant. The descriptions are neutral reminders, not judgments.</p>
      <div id="distortion-checklist"></div>
    </fieldset>

    <label for="notes">Notes or reflections (optional)</label>
    <textarea id="notes" name="notes" rows="3"></textarea>

    <div class="form-actions">
      <button type="submit">Save locally</button>
      <button type="button" id="cancel-edit" class="secondary" hidden>Cancel edit</button>
      <p id="form-status" class="form-status" aria-live="polite"></p>
    </div>
  </form>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Entries stay on this device. Editing or deleting only affects your local data.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/cognitive-distortions/index.js' | relative_url }}"></script>
