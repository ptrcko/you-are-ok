---
layout: default
title: Story
---

<section class="tool-header">
  <h2>Story</h2>
  <p class="intro">Write a poem, a story, or a history of your experience with no judgement and no analysis.</p>
  <div class="microcopy">
    <p>This is a quiet record for you.</p>
    <p>Entries live only on this device.</p>
  </div>
</section>

<section class="form-first">
  <h2>New entry</h2>
  <form id="story-form">
    <label for="entryFormat">Format <span aria-hidden="true">(required)</span></label>
    <select id="entryFormat" name="entryFormat" required>
      <option value="">Choose one</option>
      <option value="poem">Poem</option>
      <option value="story">Story</option>
      <option value="history">History</option>
    </select>

    <label for="title">Title (optional)</label>
    <input id="title" name="title" type="text" autocomplete="off" />

    <label for="body">Your writing <span aria-hidden="true">(required)</span></label>
    <textarea id="body" name="body" rows="6" required></textarea>
    <p class="hint">Write freely. This space is just for you.</p>

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
      <li>Pick a format and write whatever you want to remember.</li>
      <li>Saving keeps the entry in this browser only.</li>
      <li>Editing replaces the saved copy; deleting removes it from this device.</li>
    </ul>
  </details>
</section>

<section>
  <h2>Saved entries</h2>
  <p class="notice">No data is sent to a server; everything stays in your browser.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/story/index.js' | relative_url }}"></script>
