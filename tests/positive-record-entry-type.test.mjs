import test from 'node:test';
import assert from 'node:assert/strict';
import { createEntry } from '../assets/js/tools/positive-record/data.js';

test('createEntry marks remembered entries for past dates', () => {
  const entry = createEntry({
    todayAnswer: 'yes',
    pastAnswer: 'no',
    pastDate: 'January 1, 2020',
  });

  assert.equal(entry.entry_type, 'remembered');
  assert.equal(entry.analytics.entry_type, 'remembered');
});

test('createEntry keeps same_day when past date is today', () => {
  const today = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const entry = createEntry({
    todayAnswer: 'no',
    pastAnswer: 'yes',
    pastDate: today,
  });

  assert.equal(entry.entry_type, 'same_day');
  assert.equal(entry.analytics.entry_type, 'same_day');
});

test('createEntry preserves YYYY-MM-DD calendar dates without timezone shifts', () => {
  const entry = createEntry({
    todayAnswer: 'yes',
    pastAnswer: 'no',
    pastDate: '2026-04-11',
  });

  assert.equal(entry.past_date_iso, '2026-04-11');
});

test('positive-record controller module imports without duplicate-ui import errors', async () => {
  await assert.doesNotReject(() => import('../assets/js/tools/positive-record/controller.js'));
});
