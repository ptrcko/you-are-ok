import test from 'node:test';
import assert from 'node:assert/strict';
import { createEntry } from './data.js';

test('createEntry allows calendar backfill without today_answer', () => {
  const entry = createEntry({
    todayAnswer: null,
    pastAnswer: 'yes',
    pastDate: '2026-01-15',
  });

  assert.equal(entry.today_answer, null);
  assert.equal(entry.past_answer, 'yes');
  assert.equal(entry.past_date_iso, '2026-01-15');
});

test('createEntry preserves YYYY-MM-DD past dates as local-day iso', () => {
  const entry = createEntry({
    todayAnswer: 'no',
    pastAnswer: 'no',
    pastDate: '2026-03-08',
  });

  assert.equal(entry.past_date_iso, '2026-03-08');
});
