import assert from "node:assert/strict";
import test from "node:test";

import {
  localDateKey,
  shiftReminderTime,
  upsertMoodCheckIn,
} from "../src/shared/utils/wellbeing.ts";

test("localDateKey uses local calendar fields", () => {
  assert.equal(localDateKey(new Date(2026, 0, 9, 23, 30)), "2026-01-09");
});

test("one mood check-in is kept per day", () => {
  const morning = new Date(2026, 7, 21, 8, 0);
  const evening = new Date(2026, 7, 21, 20, 0);
  const first = upsertMoodCheckIn([], 1, morning);
  const updated = upsertMoodCheckIn(first, 4, evening);

  assert.equal(updated.length, 1);
  assert.equal(updated[0].mood, 4);
  assert.equal(updated[0].createdAt, morning.toISOString());
  assert.equal(updated[0].updatedAt, evening.toISOString());
});

test("mood history keeps only the newest 90 days", () => {
  let history = [];
  for (let day = 1; day <= 95; day += 1) {
    history = upsertMoodCheckIn(history, day % 5, new Date(2026, 0, day));
  }
  assert.equal(history.length, 90);
});

test("reminder time wraps across midnight", () => {
  assert.deepEqual(shiftReminderTime(23, 45, 30), { hour: 0, minute: 15 });
  assert.deepEqual(shiftReminderTime(0, 15, -30), { hour: 23, minute: 45 });
});
