---
layout: default
title: Fear Hierarchy
---

<section class="tool-header">
  <h2>Fear Hierarchy</h2>
  <p class="intro">Lay out fears from least to most intense so you can see them in one place.</p>
  <div class="microcopy">
    <p>No scores, timers, or streaks are displayed.</p>
    <p>Everything you record stays on this device.</p>
  </div>
</section>

<section class="form-first">
  <h2>New hierarchy</h2>
  <form id="hierarchy-form">
    <label for="fear-summary">Describe your fear</label>
    <textarea id="fear-summary" name="fearSummary" rows="3" required></textarea>
    <p class="hint">Keep it in your own words. It can be brief.</p>

    <fieldset>
      <legend>Levels (least to most frightening)</legend>
      <p class="hint">Start with the least frightening activity at Level 1 and move upward. You can leave levels blank.</p>
      <div id="levels-container"></div>
    </fieldset>

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
      <li>Write a short description of the fear you are mapping.</li>
      <li>Add up to ten levels. The numbering is fixed to keep the order clear.</li>
      <li>Save to keep the hierarchy on this device. You can reopen, edit, or delete it later.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved hierarchies</h2>
  <p class="notice">Data remains in your browser only. Editing or deleting affects local storage, not a server.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/fear-hierarchy/index.js' | relative_url }}"></script>
