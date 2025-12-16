---
layout: default
title: Cost–Benefit Analysis
---

<section class="tool-header">
  <h2>Cost–Benefit Analysis</h2>
  <p class="intro">Lay out what feels helpful and what feels costly about a belief, habit, or attitude.</p>
  <div class="microcopy">
    <p>No scoring, totals, or recommendations are made.</p>
    <p>Each side is presented in the same way to keep the focus on reflection.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="cba-form">
    <label for="focus">Belief, habit, or attitude</label>
    <textarea id="focus" name="focus" rows="3" required></textarea>
    <p class="hint">Write it in your own words. You can keep it brief.</p>

    <div class="segmented" role="tablist" aria-label="Advantages and disadvantages">
      <button type="button" class="segment" data-side="advantages" aria-selected="true" role="tab">Advantages</button>
      <button type="button" class="segment" data-side="disadvantages" aria-selected="false" role="tab">Disadvantages</button>
    </div>

    <div class="side-panel" data-side="advantages" role="tabpanel" aria-label="Advantages panel">
      <label for="advantage-input">Add an advantage</label>
      <input type="text" id="advantage-input" name="advantage" autocomplete="off" />
      <p class="hint">Note anything that feels helpful, protective, or familiar.</p>
      <div class="form-actions inline">
        <button type="button" id="add-advantage">Add to list</button>
      </div>
      <div id="advantage-list" class="item-list" aria-live="polite"></div>
    </div>

    <div class="side-panel" data-side="disadvantages" role="tabpanel" aria-label="Disadvantages panel" hidden>
      <label for="disadvantage-input">Add a disadvantage</label>
      <input type="text" id="disadvantage-input" name="disadvantage" autocomplete="off" />
      <p class="hint">Note anything that feels costly, limiting, or tiring.</p>
      <div class="form-actions inline">
        <button type="button" id="add-disadvantage">Add to list</button>
      </div>
      <div id="disadvantage-list" class="item-list" aria-live="polite"></div>
    </div>

    <label for="notes">Notes (optional)</label>
    <textarea id="notes" name="notes" rows="3" aria-describedby="notes-hint"></textarea>
    <p class="hint" id="notes-hint">Use this space for context, observations, or anything you want to remember.</p>

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
      <li>Write the belief or habit in your own words.</li>
      <li>Add any number of observations on each side. The lists use the same layout to keep them neutral.</li>
      <li>Save to keep the entry on this device. You can reopen, edit, or delete it later.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">Entries stay on this device. Editing or deleting only affects your local data.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/cost-benefit-analysis/index.js' | relative_url }}"></script>
