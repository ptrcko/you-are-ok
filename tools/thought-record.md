---
layout: default
title: Thought Record
---

<section class="tool-header">
  <h2>Thought Record</h2>
  <p class="intro">Capture the situation, automatic thought, and any evidence you want to revisit later.</p>
  <div class="microcopy">
    <p>Fields marked required need text before saving.</p>
    <p>Entries stay on this device and can be reopened or deleted.</p>
  </div>
</section>

<section class="form-first">
  <h2>New record</h2>
  <form id="thought-record-form">
    <label for="situation">Situation <span aria-hidden="true">(required)</span></label>
    <textarea id="situation" name="situation" rows="3" required></textarea>
    <p class="hint">Where you were, who was there, and what was happening.</p>

    <label for="automaticThought">Automatic thought <span aria-hidden="true">(required)</span></label>
    <textarea id="automaticThought" name="automaticThought" rows="3" required></textarea>
    <p class="hint">Write the thought exactly as it showed up.</p>

    <label for="feelings">Feelings (optional)</label>
    <textarea id="feelings" name="feelings" rows="2"></textarea>

    <label for="supportingEvidence">Supporting evidence (optional)</label>
    <textarea id="supportingEvidence" name="supportingEvidence" rows="2"></textarea>

    <label for="contradictingEvidence">Contradicting evidence (optional)</label>
    <textarea id="contradictingEvidence" name="contradictingEvidence" rows="2"></textarea>

    <label for="balancedResponse">Balanced response or next step (optional)</label>
    <textarea id="balancedResponse" name="balancedResponse" rows="2"></textarea>

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
      <li>Save at any point; you do not have to fill every field.</li>
      <li>Editing replaces the saved copy on this device only.</li>
      <li>Deleting removes the entry from local storage.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved thought records</h2>
  <p class="notice">Entries are stored in your browser only and never sent to a server.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/thought-record/index.js' | relative_url }}"></script>
