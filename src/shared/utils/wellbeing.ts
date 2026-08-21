export type MoodCheckIn = {
  id: string;
  mood: number;
  createdAt: string;
  updatedAt?: string;
};

export function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function upsertMoodCheckIn(
  history: MoodCheckIn[],
  mood: number,
  now = new Date(),
) {
  const id = localDateKey(now);
  const existing = history.find((item) => item.id === id);
  const next: MoodCheckIn = existing
    ? { ...existing, mood, updatedAt: now.toISOString() }
    : { id, mood, createdAt: now.toISOString() };

  return [next, ...history.filter((item) => item.id !== id)].slice(0, 90);
}

export function shiftReminderTime(
  hour: number,
  minute: number,
  deltaMinutes: number,
) {
  const dayMinutes = 24 * 60;
  const total = (hour * 60 + minute + deltaMinutes + dayMinutes) % dayMinutes;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}
