import { byId } from "./skills.js";
import { dateKey, fromKey } from "./model.js";

const backupFormat = "planer-kalisteniczny";

export function createBackup(state) {
  return JSON.stringify({ format: backupFormat, version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && dateKey(fromKey(value)) === value;
}

function isSkill(id) {
  return typeof id === "string" && Object.hasOwn(byId, id);
}

function isLevel(skill, level) {
  return isSkill(skill) && Number.isInteger(level) && level >= 0 && level < byId[skill].levels.length;
}

function isRecord(record) {
  if (!isObject(record) || !isLevel(record.skill, record.level)) return false;
  const level = byId[record.skill].levels[record.level];
  const max = level.unit === "s" ? 3600 : 500;
  return typeof record.id === "string" && /^[\w-]{1,80}$/.test(record.id)
    && Number.isSafeInteger(record.created) && record.created >= 0
    && isDate(record.date) && Array.isArray(record.sets) && record.sets.length >= 1 && record.sets.length <= 12
    && record.sets.every(value => Number.isInteger(value) && value > 0 && value <= max)
    && (level.load ? Number.isFinite(record.load) && record.load >= 0.01 && record.load <= 150 : record.load === null)
    && typeof record.technique === "boolean" && typeof record.note === "string" && record.note.length <= 400;
}

function isWeek(day, sessions) {
  return isDate(day) && fromKey(day).getDay() === 1 && Array.isArray(sessions) && sessions.length === 3
    && sessions.every(session => isObject(session) && Number.isInteger(session.day) && session.day >= 0 && session.day < 7
      && typeof session.done === "boolean" && Array.isArray(session.items) && session.items.length >= 1 && session.items.length <= 2
      && session.items.every(isSkill) && new Set(session.items).size === session.items.length);
}

export function readBackup(content) {
  const file = JSON.parse(content);
  const data = file?.data;
  if (file?.format !== backupFormat || file.version !== 1 || !isObject(data)
    || !isObject(data.current) || !Object.entries(data.current).every(([id, level]) => isLevel(id, level))
    || !Array.isArray(data.records) || !data.records.every(isRecord)
    || !isObject(data.weeks) || !Object.entries(data.weeks).every(([day, sessions]) => isWeek(day, sessions))) {
    throw new Error("Nieprawidłowa kopia planera.");
  }
  return { current: data.current, records: data.records, weeks: data.weeks };
}

export function mergeBackup(state, backup) {
  state.current = { ...backup.current, ...state.current };
  state.weeks = { ...backup.weeks, ...state.weeks };
  const results = new Map(backup.records.map(record => [record.id, record]));
  for (const record of state.records) results.set(record.id, record);
  state.records = [...results.values()];
}
