---
layout: default
title: Anxiety Profile (Self-Reflection Checklist)
---

<section class="tool-header">
  <h2>Anxiety Profile (Self-Reflection Checklist)</h2>
  <p class="intro">A way to notice which kinds of anxiety experiences feel familiar to you.</p>
  <div class="microcopy">
    <p>These are not diagnoses.</p>
    <p>Many people recognise more than one.</p>
    <p>This does not determine what tools you should use.</p>
  </div>
</section>

<section class="form-first">
  <h2>Checklist</h2>
  <p class="hint">Tap anywhere on a row to select or clear it. There is no required number of selections.</p>
  <form id="anxiety-profile-form">
    <fieldset>
      <legend>Experiences you might recognise</legend>
      <div id="anxiety-checklist"></div>
    </fieldset>

    <label for="notes">Notes for yourself (optional)</label>
    <textarea id="notes" name="notes" rows="3" aria-describedby="notes-hint"></textarea>
    <p id="notes-hint" class="hint">Add thoughts about patterns you notice or contexts where these show up.</p>

    <div class="form-actions">
      <button type="submit">Save selection locally</button>
      <button type="button" class="secondary" id="reset-form">Clear form</button>
      <p id="form-status" class="form-status" aria-live="polite"></p>
    </div>
  </form>
</section>

<section class="supporting">
  <details class="collapsible" aria-label="How this checklist works">
    <summary>How this checklist works</summary>
    <ul>
      <li>Browse the descriptions and check any that feel familiar. Leaving everything unchecked is also fine.</li>
      <li>Your selections are saved only on this device. You can reopen, edit, or clear them later.</li>
      <li>Selections are not interpreted, ranked, or scored. They are simply recorded for your awareness.</li>
      <li>The same reminders apply: these are not diagnoses; many people recognise more than one; this does not determine what tools you should use.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved selection</h2>
  <p class="notice">Saved entries stay on this device and can be deleted at any time.</p>
  <div id="saved-selection"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/anxiety-profile/index.js' | relative_url }}"></script>
