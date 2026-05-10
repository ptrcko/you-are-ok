---
layout: default
title: Sample Data
---

<section>
  <h1>Sample Data</h1>
  <p>Use this page to add recent sample entries (last 3 weeks) for each tool, or clear all saved entries.</p>
  <div class="form-actions">
    <button id="add-sample-data" type="button">Add sample data</button>
    <button id="clear-sample-data" type="button" class="danger">Clear sample data</button>
  </div>
  <p id="sample-data-message" role="status" aria-live="polite"></p>
  <p><a href="{{ '/' | relative_url }}">Back to home page</a></p>
</section>

<script type="module" src="{{ '/assets/js/sample-data.js' | relative_url }}"></script>
