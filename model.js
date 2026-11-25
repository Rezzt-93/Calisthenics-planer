export const weekDays = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
export const sessionNames = ["Trening A", "Trening B", "Trening C"];

export function blankState() {
  return { current: {}, records: [], weeks: {} };
}

export function dateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromKey(key) {
  return new Date(`${key}T12:00:00`);
}

export function shiftDate(date, days) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

export function startOfWeek(date = new Date()) {
  return shiftDate(date, -((date.getDay() + 6) % 7));
}

export function weekFor(state, key) {
  const plan = state.weeks[key];
  return plan ?? [
    { day: 0, items: ["lsit", "pushup"], done: false },
    { day: 2, items: ["pike", "back"], done: false },
    { day: 4, items: ["core", "legs"], done: false },
  ];
}

export function levelIndex(state, skill) {
  return state.current[skill.id] ?? skill.suggested;
}

export function targetText(level) {
  return `${level.sets} × ${level.goal} ${level.unit}${level.side ? " na stronę" : ""}`;
}

export function parseSets(input, unit) {
  const tokens = input.trim().split(/[\s,;]+/);
  if (tokens.length > 12 || tokens.some(value => !/^\d{1,4}$/.test(value))) return null;
  const numbers = tokens.map(Number);
  const max = unit === "s" ? 3600 : 500;
  return numbers.every(value => value > 0 && value <= max) ? numbers : null;
}

export function qualifyingDays(records, skillId, index, level) {
  return new Set(records.filter(record => {
    if (record.skill !== skillId || record.level !== index || !record.technique) return false;
    if (level.load && !(record.load > 0)) return false;
    return record.sets.filter(value => value >= level.goal).length >= level.sets;
  }).map(record => record.date)).size;
}
