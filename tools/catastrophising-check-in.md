---
layout: default
title: Catastrophising Check-In
---

<section class="tool-header">
  <h2>Catastrophising Check-In</h2>
  <p class="intro">Note a future-focused thought, pause briefly, and return to the same question over time.</p>
  <div class="microcopy">
    <p>Entries stay on this device only.</p>
    <p>Responses can be short or empty; the goal is gentle awareness.</p>
    <p>After noting the thought, take a brief pause or a single calm breath.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="catastrophising-form">
    <label for="thought">Thought <span aria-hidden="true">(required)</span></label>
    <textarea id="thought" name="thought" rows="3" required></textarea>
    <p class="hint">Write the thought exactly as it appeared.</p>

    <label for="context">Context (optional)</label>
    <textarea id="context" name="context" rows="2"></textarea>

    <label for="outcomeDate">Outcome date (optional)</label>
    <input id="outcomeDate" name="outcomeDate" type="date" class="date-input" />
    <p class="hint">Adds a repeat of the same question on that date.</p>

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
      <li>Enter the thought as-is. Context is optional.</li>
      <li>Saving creates check-ins at 15 minutes, 1 hour, and 4 hours with the same question.</li>
      <li>If you add an outcome date, the same question repeats on that date.</li>
      <li>You can edit the thought or add evidence later; everything stays in your browser.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Check-ins and responses are stored in your browser only.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/catastrophising-check-in/index.js' | relative_url }}"></script>
