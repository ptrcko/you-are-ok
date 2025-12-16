---
layout: default
title: Relapse Awareness Log
---

<section class="tool-header">
  <h2>Relapse Awareness Log</h2>
  <p class="intro">Normalize setbacks by noting what happened, how you felt, and what helped.</p>
  <div class="microcopy">
    <p>Entries live only on this device.</p>
    <p>No scores, warnings, or comparisons are generated.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="relapse-form">
    <label for="eventDescription">Event or setback <span aria-hidden="true">(required)</span></label>
    <textarea id="eventDescription" name="eventDescription" rows="3" required></textarea>

    <label for="feelingsBefore">Feelings before <span aria-hidden="true">(required)</span></label>
    <textarea id="feelingsBefore" name="feelingsBefore" rows="2" required></textarea>

    <label for="feelingsAfter">Feelings after (optional)</label>
    <textarea id="feelingsAfter" name="feelingsAfter" rows="2"></textarea>

    <label for="helpfulResponse">What helped (optional)</label>
    <textarea id="helpfulResponse" name="helpfulResponse" rows="2"></textarea>

    <label for="reflections">Reflections or takeaways (optional)</label>
    <textarea id="reflections" name="reflections" rows="3"></textarea>

    <label for="supportNeeded">Support that could help (optional)</label>
    <textarea id="supportNeeded" name="supportNeeded" rows="2"></textarea>

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
      <li>Saving requires the event and how you felt beforehand.</li>
      <li>Editing overwrites the existing copy on this device.</li>
      <li>Deleting removes the entry from local storage.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">No data is sent to a server; everything stays in your browser.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/relapse-awareness-log/index.js' | relative_url }}"></script>
