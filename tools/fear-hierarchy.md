---
layout: default
title: Fear Hierarchy
---

<section class="tool-header">
  <h2>Fear Hierarchy</h2>
  <p class="intro">Capture the fears that are present right now, then arrange them in the order that fits.</p>
  <div class="microcopy">
    <p>No scores, timers, or streaks are displayed.</p>
    <p>Everything you record stays on this device.</p>
  </div>
</section>

<section class="form-first">
  <h2>New fear list</h2>
  <form id="hierarchy-form">
    <fieldset>
      <legend>Fears (least to most intense)</legend>
      <p class="hint">Add the fears in any order, then drag or use the arrow buttons to rearrange them. Leave blank rows unused.</p>
      <div id="levels-container"></div>
    </fieldset>

    <label for="fear-comments">Comments (optional)</label>
    <textarea id="fear-comments" name="comments" rows="3"></textarea>
    <p class="hint">Add context, reminders, or anything you want to revisit later.</p>

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
      <li>List the fears showing up for you right now.</li>
      <li>Reorder them until the sequence feels right.</li>
      <li>Add optional comments if you want extra context.</li>
      <li>Save to keep the list on this device. You can reopen, edit, or delete it later.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved fear lists</h2>
  <p class="notice">Data remains in your browser only. Editing or deleting affects local storage, not a server.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/fear-hierarchy/index.js' | relative_url }}"></script>
