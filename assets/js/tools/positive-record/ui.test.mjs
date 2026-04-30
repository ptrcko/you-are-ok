import test from 'node:test';
import assert from 'node:assert/strict';
import { createCalendarMarkup, isRememberedLogDate } from './ui.js';

test('isRememberedLogDate identifies dates before local today', () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  assert.equal(isRememberedLogDate(yesterday), true);
  assert.equal(isRememberedLogDate(today), false);
  assert.equal(isRememberedLogDate(tomorrow), false);
});

test('calendar markup includes remembered visual and accessible cue', () => {
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isoDay = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
    yesterday.getDate(),
  ).padStart(2, '0')}`;

  const { markup } = createCalendarMarkup([
    {
      today_answer: 'yes',
      past_answer: 'no',
      past_date_iso: isoDay,
      createdAt: now.toISOString(),
    },
  ]);

  assert.match(markup, /calendar-cell good remembered-log/);
  assert.match(markup, /legend-dot remembered/);
});

test('calendar exposes selectable unanswered days in the past', () => {
  const { markup, unansweredByKey } = createCalendarMarkup([]);
  assert.match(markup, /data-missed-date=/);
  assert.ok(unansweredByKey.size > 0);
});

test('calendar day mapping uses local past_date_iso without UTC shift', () => {
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isoDay = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
    yesterday.getDate(),
  ).padStart(2, '0')}`;

  const { markup } = createCalendarMarkup([
    {
      today_answer: null,
      past_answer: 'yes',
      past_date_iso: isoDay,
      createdAt: now.toISOString(),
    },
  ]);

  assert.match(markup, /calendar-cell tough remembered-log/);
});
