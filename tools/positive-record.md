---
layout: default
title: Daily Good Record
---

<section class="tool-header">
  <h2>Daily Good Record</h2>
  <p class="intro">A short two-step check-in to build perspective over time.</p>
  <div class="microcopy">
    <p>Keep it simple: answer each question with a single choice.</p>
    <p>No interpretation, no pressure, and no extra explanation required.</p>
  </div>
</section>

<section>
  <h2>Today</h2>
  <p id="today-question" class="question-text">Did anything bad happen today?</p>
  <div id="today-options" class="form-actions" role="group" aria-labelledby="today-question">
    <button type="button" data-answer="yes">Yes</button>
    <button type="button" data-answer="no" class="secondary">No</button>
  </div>
</section>

<section id="past-section" hidden>
  <h2>Past day</h2>
  <p id="past-question" class="question-text"></p>
  <p id="past-date-note" class="date-summary-chip" aria-live="polite" hidden></p>
  <div id="past-options" class="form-actions" role="group" aria-labelledby="past-question">
    <button type="button" data-answer="yes">Yes</button>
    <button type="button" data-answer="no" class="secondary">No</button>
    <button type="button" data-answer="i_dont_remember" class="secondary">I don’t remember</button>
  </div>
</section>

<section id="reflection-section" hidden>
  <h2>Reflection (optional)</h2>
  <p id="review-date" class="review-date"></p>
  <p id="reflection-text" class="notice"></p>
  <p id="form-status" class="form-status" aria-live="polite"></p>
</section>


<section>
  <h2>Progress view</h2>
  <p class="notice">A suggested past day appears after each check-in, and you can also fill missed days from the calendar below.</p>
  <div id="viz-panels" class="viz-panels"></div>
</section>

<section>
  <h2>Saved check-ins</h2>
  <p class="notice">Entries are stored in your browser only and never sent anywhere.</p>
  <div id="entries"></div>
</section>

<script type="module" src="{{ '/assets/js/tools/positive-record/index.js' | relative_url }}"></script>
