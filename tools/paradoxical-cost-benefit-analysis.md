---
layout: default
title: Paradoxical Cost–Benefit Analysis
---

<section class="tool-header">
  <h2>Paradoxical Cost–Benefit Analysis</h2>
  <p class="intro">Collect advantages of holding onto a thought or habit, without forcing change.</p>
  <div class="microcopy">
    <p>Two variants are available: one for thoughts, one for habits.</p>
    <p>Everything is saved locally only.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="paradoxical-form">
    <fieldset>
      <legend>Entry type</legend>
      <label><input type="radio" name="entryType" value="thought" checked /> Thought</label>
      <label><input type="radio" name="entryType" value="habit" /> Habit</label>
    </fieldset>

    <label for="focus">List the thought or habit you've selected</label>
    <textarea id="focus" name="focus" rows="3" required></textarea>
    <p class="hint">Use your own words. The text is stored exactly as you type it.</p>

    <label for="advantage-input">Advantages</label>
    <textarea id="advantage-input" name="advantage" rows="2" autocomplete="off"></textarea>
    <p class="hint">Add reasons the thought or habit feels useful, protective, or familiar.</p>
    <div class="form-actions inline">
      <button type="button" id="add-advantage">Add to list</button>
    </div>
    <div id="advantage-list" class="item-list" aria-live="polite"></div>

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
      <li>Pick whether you are focusing on a thought or a habit.</li>
      <li>List advantages in a simple, single-column list. You can add as many as you like.</li>
      <li>Save to keep the entry on this device. You can reopen, edit, or delete it later.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Entries remain in your browser only. Removing an item affects local storage, not a server.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/paradoxical-cost-benefit-analysis/index.js' | relative_url }}"></script>
