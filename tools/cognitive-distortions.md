---
layout: default
title: Cognitive Distortions Log
---

<section class="tool-header">
  <h2>Cognitive Distortions Log</h2>
  <p class="intro">A quiet place to note a thought and mark any distortions that might fit.</p>
  <div class="microcopy">
    <p>You don’t have to fill in every field.</p>
    <p>You can come back to this later.</p>
    <p>Nothing here is scored or interpreted.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="distortion-form">
    <label for="thought">Thought</label>
    <textarea id="thought" name="thought" rows="4" required></textarea>
    <p class="hint">Write it in your own words. Stop whenever you like.</p>

    <fieldset>
      <legend>Cognitive distortions checklist</legend>
      <p class="hint">Tap any that seem relevant. The checkbox just marks your selection.</p>
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

<section class="supporting">
  <details class="collapsible" aria-label="How this page works">
    <summary>How this page works</summary>
    <ul>
      <li>Write the thought in your own words.</li>
      <li>Select one or more distortions from the checklist. The list is read-only reference text.</li>
      <li>Optionally add notes or reflections.</li>
      <li>Save to keep the entry on this device. You can reopen, edit, or delete it later.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Entries stay on this device. Editing or deleting only affects your local data.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/cognitive-distortions/index.js' | relative_url }}"></script>
