---
layout: default
title: Positive Record
---

<section class="tool-header">
  <h2>Positive Record</h2>
  <p class="intro">Start with a thought or feeling and list real, positive facts that sit alongside it.</p>
  <div class="microcopy">
    <p>Everything is saved locally on this device.</p>
    <p>Add as many positives as you like; you can edit or delete entries anytime.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="positive-record-form">
    <label for="focus">Thought or feeling <span aria-hidden="true">(required)</span></label>
    <textarea id="focus" name="focus" rows="3" required></textarea>
    <p class="hint">Example: "What have I achieved?" or "I feel like I am falling behind."</p>

    <label for="positive-input">Positives that belong with it</label>
    <textarea id="positive-input" name="positive" rows="2" autocomplete="off"></textarea>
    <p class="hint">Add factual evidence, achievements, or moments of support that counter the negative thought.</p>
    <div class="form-actions inline">
      <button type="button" id="add-positive">Add to list</button>
    </div>
    <div id="positive-list" class="item-list" aria-live="polite"></div>

    <label for="notes">Notes (optional)</label>
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
      <li>Use your own wording for the thought or feeling; it helps when revisiting later.</li>
      <li>List concrete positives, not aspirations—things you have done, noticed, or experienced.</li>
      <li>Saving keeps a copy in your browser only. You can edit or delete it on this device.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Entries are stored in your browser only and never sent to a server.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/positive-record/index.js' | relative_url }}"></script>
