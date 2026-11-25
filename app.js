import { createBackup, readBackup, mergeBackup } from "./backup.js";
import { difficulties } from "./static-skills.js";
import { photos } from "./pose-photos.js";
import { catalog, byId, categories } from "./skills.js";
import { blankState, dateKey, fromKey, shiftDate, startOfWeek, weekFor, weekDays, sessionNames, levelIndex, targetText, parseSets, qualifyingDays } from "./model.js";

const icons = {
  brand: '<path d="m4 16 4.4-6 3.2 3.4L18 6m-4 0h4v4M5 20h14"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 5h2m4 0h2"/>',
  history: '<path d="M3 11a9 9 0 1 1 3 8m-3-4v-4h4m5-4v5l3 2"/>',
  shield: '<path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
  bars: '<path d="M3 18h6m6 0h6M6 18V8h12v10M3 8h18"/>',
  band: '<path d="M7 5c-5 0-6 6-2 8l10 6c5 3 9-4 4-7L9 6c-2-1-4 1-2 3l10 6"/>',
  mat: '<path d="M4 6h13a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a2 2 0 0 1 0-4h13a1 1 0 0 0 1-1V9"/><path d="M2 16V8a2 2 0 0 1 2-2"/>',
  dumbbell: '<path d="M7 7v10m-4-8v6m14-8v10m4-8v6M7 12h10M3 12h4m10 0h4"/>',
  pushup: '<path d="M3 19h18m-16-4 3-3 7 2 4 4m-4-4-1-4m0 0-4 6-1 3"/><circle cx="17" cy="8" r="1.7"/>',
  pike: '<path d="M3 19h18M5 17l6-10 6 6m0 0 2 6m-2-6-4 5"/><circle cx="19" cy="10" r="1.5"/>',
  core: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>',
  legs: '<path d="m12 3-3 7 5 4-2 6h5m-8-10-4 7v3H2m12-6 5-2"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
};

const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const main = document.getElementById("main");
const dialog = document.getElementById("detail-dialog");
const toast = document.getElementById("toast");
const storageKey = "calisthenics-planner-v1";
const number = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 });
const fullDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });
const dayMonth = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long" });
const labels = { umiejetnosci: "Umiejętności", tydzien: "Tydzień", historia: "Historia", dane: "Dane" };
let state = readState();
let filter = "all";
let sortByDifficulty = false;
let weekOffset = 0;
let selectedSkill = null;
let selectedLevel = 0;
let editRecord = null;
let returnFocus = null;
let toastTimer;

function readState() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) ?? blankState() : blankState();
  } catch {
    return blankState();
  }
}

function updateState(change, errorTarget) {
  const next = readState();
  change(next);
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    const message = "Przeglądarka blokuje zapis danych. Zezwól na zapisywanie danych tej strony i spróbuj ponownie.";
    if (errorTarget) errorTarget.textContent = message;
    else showToast(message);
    return false;
  }
  state = next;
  return true;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toastTimer = setTimeout(() => { toast.textContent = ""; }, 4200);
}

function route() {
  const hash = location.hash.slice(1);
  return Object.hasOwn(labels, hash) ? hash : "umiejetnosci";
}

function renderPage() {
  const key = route();
  document.getElementById("breadcrumb").textContent = labels[key];
  document.querySelectorAll("[data-route]").forEach(link => {
    if (link.dataset.route === key) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  main.innerHTML = { umiejetnosci: renderOverview, tydzien: renderWeek, historia: renderHistory, dane: renderData }[key]();
}

function renderOverview() {
  const completed = weekFor(state, dateKey(startOfWeek())).filter(session => session.done).length;
  return `
    <section class="hero" aria-labelledby="overview-title">
      <div class="hero-copy">
        <h1 id="overview-title">Progresja<br><span>kalisteniczna</span></h1>
        <p>Wybieraj poziomy, zapisuj wyniki i wplataj progresje w swoje trzy treningi siłowe.</p>
        <a class="button primary" href="#tydzien">${icon("calendar")} Zobacz tydzień</a>
      </div>
    </section>
    <div class="stats">
      ${stat("grid", catalog.length, "Umiejętności")}
      ${stat("calendar", `${completed} / 3`, "Treningi w tym tygodniu")}
      ${stat("history", state.records.length, "Zapisane wyniki")}
    </div>
    <section aria-labelledby="skills-title">
      <div class="section-title">
        <h2 id="skills-title">Twoje progresje <span id="visible-count" class="visible-count" role="status">${visibleSkills().length} / ${catalog.length}</span></h2>
        <div class="filters" role="group" aria-label="Filtruj umiejętności">
          ${Object.entries(categories).map(([id, label]) => `<button class="filter" data-filter="${id}" aria-pressed="${filter === id}">${label}</button>`).join("")}
        </div>
      </div>
      <label class="check sort-control">
        <input type="checkbox" data-sort-difficulty ${sortByDifficulty ? "checked" : ""}> Sortuj figury od najłatwiejszej
      </label>
      <div class="cards" id="skills-grid">${renderCards()}</div>
    </section>
  `;
}

function stat(name, value, label) {
  return `<div class="stat"><span class="stat-icon">${icon(name)}</span><div><strong>${value}</strong><span class="label">${label}</span></div></div>`;
}

function visibleSkills() {
  const visible = catalog.filter(skill => filter === "all" || skill.category === filter);
  if (sortByDifficulty) visible.sort((a, b) => (a.difficulty ?? Infinity) - (b.difficulty ?? Infinity));
  return visible;
}

function refreshCards() {
  document.getElementById("visible-count").textContent = `${visibleSkills().length} / ${catalog.length}`;
  document.getElementById("skills-grid").innerHTML = renderCards();
}

function renderCards() {
  return visibleSkills().map(skill => {
    const index = levelIndex(state, skill);
    const level = skill.levels[index];
    const label = Object.hasOwn(state.current, skill.id) ? "Aktualny poziom" : "Sugerowany start";
    return `
      <article class="card">
        <div class="card-top">
          <span class="card-icon tone-${skill.tone}">${icon(skill.icon)}</span>
          <div>
            <h3>${skill.name}</h3>
            <p class="gear">${skill.gear}</p>
            ${skill.difficulty ? `<p class="figure-difficulty">Trudność ${skill.difficulty} / 5 · ${difficulties[skill.difficulty]}</p>` : ""}
          </div>
          ${photos[skill.id] ? poseImage(skill, "pose-thumb") : ""}
        </div>
        <div class="level-label"><span>${label}</span><strong>${index + 1} / ${skill.levels.length}</strong></div>
        <div class="card-level">${level.name}</div>
        <div class="segments" aria-hidden="true">${skill.levels.map((_, i) => `<i class="${i <= index ? "filled" : ""}"></i>`).join("")}</div>
        <p class="card-goal">Cel · ${targetText(level)}</p>
        <button class="button" data-skill="${skill.id}" aria-label="Otwórz progresję: ${skill.name}">Otwórz progresję</button>
      </article>
    `;
  }).join("");
}

function poseImage(skill, className = "") {
  return `<img class="${className}" src="./poses/${skill.id}.webp" alt="${photos[skill.id].alt}" loading="lazy" decoding="async">`;
}

function renderPoseFigure(skill) {
  const photo = photos[skill.id];
  const credit = photo.source
    ? `<a href="${photo.source}" target="_blank" rel="noopener noreferrer">${photo.author} · Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/${photo.license}/" target="_blank" rel="noopener noreferrer">CC ${photo.license.toUpperCase().replace("/", " ")}</a> · dostosowano rozmiar i kadr`
    : "Wizualizacja wygenerowana";
  return `
    <figure class="pose-figure">
      ${poseImage(skill)}
      <figcaption><strong>Pozycja docelowa · ${skill.difficulty} / 5</strong><span>${credit}</span></figcaption>
    </figure>`;
}

function renderWeek() {
  const week = shiftDate(startOfWeek(), weekOffset * 7);
  const key = dateKey(week);
  const plan = weekFor(state, key);
  return `
    <header class="page-head">
      <h1>Plan tygodnia</h1>
      <p>Wybierz jedną lub dwie progresje do każdego z trzech treningów. L-sit możesz ćwiczyć po rozgrzewce, a progresje siłowe w ramach serii danego ćwiczenia.</p>
    </header>
    <div class="week-controls">
      <div class="week-range">
        <h2>${dayMonth.format(week)} – ${fullDate.format(shiftDate(week, 6))}</h2>
        <p>${plan.filter(session => session.done).length} z 3 treningów zrobione</p>
      </div>
      <button class="button icon-button" data-offset="-1" aria-label="Poprzedni tydzień">${icon("left")}</button>
      <button class="button" data-offset="0" ${weekOffset === 0 ? "disabled" : ""}>Ten tydzień</button>
      <button class="button icon-button" data-offset="1" aria-label="Następny tydzień">${icon("right")}</button>
    </div>
    <div class="cards week-cards">
      ${plan.map((session, index) => renderSession(session, index, week)).join("")}
    </div>
  `;
}

function renderSession(session, index, week) {
  return `
    <article class="card week-card ${session.done ? "done" : ""}">
      <div class="week-title"><h3>${sessionNames[index]}</h3>${session.done ? '<span class="week-status">Zrobiony</span>' : ""}</div>
      <p class="week-date">${weekDays[session.day]}, ${dayMonth.format(shiftDate(week, session.day))}</p>
      <div class="week-items">
        ${session.items.map(id => {
          const skill = byId[id];
          const level = skill.levels[levelIndex(state, skill)];
          return `
            <div class="week-block">
              <strong>${skill.name}</strong>
              <small>${level.name}</small>
              ${level.equipment ? `<small>${level.equipment}</small>` : ""}
            </div>`;
        }).join("")}
      </div>
      <details class="edit-week">
        <summary>Edytuj trening</summary>
        <form class="week-form" data-session="${index}">
          <label class="field">Dzień
            <select name="day">${weekDays.map((name, day) => `<option value="${day}" ${day === session.day ? "selected" : ""}>${name}</option>`).join("")}</select>
          </label>
          <label class="field">Pierwsza progresja
            <select name="first">${skillOptions(session.items[0])}</select>
          </label>
          <label class="field">Druga progresja
            <select name="second"><option value="">Pomiń</option>${skillOptions(session.items[1])}</select>
          </label>
          <div class="form-error" role="alert"></div>
          <button class="button" type="submit">Zapisz trening</button>
        </form>
      </details>
      <button class="button week-done ${session.done ? "" : "primary"}" data-done="${index}">
        ${icon("check")}${session.done ? "Cofnij oznaczenie" : "Oznacz jako zrobiony"}
      </button>
    </article>
  `;
}

function skillOptions(selected) {
  return Object.entries(categories).filter(([id]) => id !== "all").map(([category, label]) => `
    <optgroup label="${label}">
      ${catalog.filter(skill => skill.category === category).map(skill =>
        `<option value="${skill.id}" ${skill.id === selected ? "selected" : ""}>${skill.name}</option>`
      ).join("")}
    </optgroup>`).join("");
}

function renderData() {
  return `
    <header class="page-head">
      <h1>Dane treningowe</h1>
      <p>Zapisz kopię i przenieś wyniki, aktualne poziomy oraz plany tygodni do innej przeglądarki lub na nowy adres planera.</p>
    </header>
    <div class="data-panels">
      <section class="card data-panel">
        <h2>Eksport</h2>
        <p>Plik JSON obejmuje wszystkie dane zapisane w tej przeglądarce.</p>
        <button type="button" class="button primary" data-export-data>${icon("download")} Pobierz kopię JSON</button>
      </section>
      <section class="card data-panel">
        <h2>Import</h2>
        <p>Import dopisuje brakujące dane. Przy powtórzeniach pierwszeństwo mają wyniki, poziomy i tygodnie zapisane tutaj.</p>
        <form class="import-form">
          <label class="field">Plik kopii
            <input name="backup" type="file" accept=".json,application/json" required>
          </label>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="button">Importuj kopię</button>
        </form>
      </section>
    </div>`;
}

function downloadBackup() {
  const blob = new Blob([createBackup(readState())], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `planer-kalisteniczny-${dateKey()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importBackup(form) {
  const file = form.elements.backup.files[0];
  const submit = form.querySelector("button");
  const error = form.querySelector(".form-error");
  error.textContent = "";
  submit.disabled = true;
  try {
    if (!file || file.size > 10 * 1024 * 1024) throw new Error();
    const backup = readBackup(await file.text());
    if (updateState(next => mergeBackup(next, backup), error)) {
      form.reset();
      showToast("Zaimportowano kopię danych.");
    }
  } catch {
    error.textContent = "Wybierz prawidłową kopię JSON wyeksportowaną z planera (do 10 MB).";
  } finally {
    submit.disabled = false;
  }
}

function renderHistory() {
  const records = [...state.records].sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created);
  return `
    <header class="page-head">
      <h1>Historia wyników</h1>
      <p>Czas, powtórzenia i obciążenia zapisane na poszczególnych poziomach.</p>
    </header>
    ${records.length ? `<div class="record-list">${records.map(renderRecord).join("")}</div>` : `
      <div class="empty">
        <p>Brak zapisanych wyników. Otwórz dowolną progresję, aby zapisać pierwsze serie.</p>
        <a class="button primary" href="#umiejetnosci">Otwórz progresje</a>
      </div>`}
  `;
}

function renderRecord(record) {
  const skill = byId[record.skill];
  const level = skill.levels[record.level];
  const load = record.load ? ` · ${number.format(record.load)} kg na hantel` : "";
  return `
    <article class="record-card">
      <div>
        <div class="record-meta">${fullDate.format(fromKey(record.date))} · Poziom ${record.level + 1}</div>
        <h3>${skill.name}</h3>
        <p>${level.name}</p>
        <p class="result">${record.sets.join(" / ")} ${level.unit}${level.side ? " na stronę" : ""}${load}</p>
        ${record.technique ? "<p>Technika zgodna z opisem</p>" : ""}
        ${record.note ? `<p>${esc(record.note)}</p>` : ""}
      </div>
      <button class="button" data-edit="${esc(record.id)}">Edytuj</button>
    </article>
  `;
}

function openDetail(skill, trigger, record = null) {
  selectedSkill = skill;
  selectedLevel = record?.level ?? levelIndex(state, skill);
  editRecord = record;
  returnFocus = trigger;
  renderDetail();
  dialog.showModal();
}

function renderDetail(draft = null, feedback = "") {
  const skill = selectedSkill;
  const level = skill.levels[selectedLevel];
  const current = state.current[skill.id];
  const last = selectedLevel === skill.levels.length - 1;
  const qualified = qualifyingDays(state.records, skill.id, selectedLevel, level);
  const values = draft ?? {
    date: editRecord?.date ?? dateKey(),
    sets: editRecord?.sets.join(" ") ?? "",
    load: editRecord?.load ?? "",
    note: editRecord?.note ?? "",
    technique: editRecord?.technique ? "on" : "",
  };
  dialog.innerHTML = `
    <div class="dialog-header">
      <h2 id="detail-title">${editRecord ? "Edytuj wynik · " : ""}${skill.name}</h2>
      <button class="button icon-button" data-close aria-label="Zamknij" autofocus>${icon("close")}</button>
    </div>
    <div class="dialog-content">
      ${editRecord ? `<p>Poziom ${selectedLevel + 1} · ${level.name}</p>` : `
        ${photos[skill.id] ? renderPoseFigure(skill) : ""}
        <p>${skill.tip}</p>
        <ol class="level-list" aria-label="Poziomy progresji">
          ${skill.levels.map((item, index) => `
            <li><button class="level-tab" data-level="${index}" aria-pressed="${selectedLevel === index}">
              <span class="level-number">${index + 1}</span><span>${item.name}</span>
              ${index === current ? '<span class="level-badge">Aktualny</span>' : index === skill.suggested && current === undefined ? '<span class="level-badge">Sugerowany</span>' : ""}
            </button></li>
          `).join("")}
        </ol>
        <section class="level-details" aria-labelledby="level-title">
          <h3 id="level-title">${level.name}</h3>
          <p>${level.cue}</p>
          ${level.equipment ? `<p><strong>Sprzęt na tym etapie</strong> · ${level.equipment}</p>` : ""}
          <p class="criterion"><strong>${last ? "Cel poziomu" : "Kryterium przejścia"}</strong> · ${targetText(level)} z techniką zgodną z opisem na dwóch różnych treningach.</p>
          <p class="${qualified >= 2 ? "qualified" : ""}">${Math.min(qualified, 2)} / 2 treningi spełniające kryterium${qualified >= 2 ? " · Cel osiągnięty" : ""}</p>
          ${current === selectedLevel ? '<p class="qualified">To Twój aktualny poziom.</p>' : '<button class="button" data-set-level>Ustaw jako aktualny</button>'}
        </section>`}
      <h3 class="result-heading">${editRecord ? "Dane treningu" : "Zapisz wynik na tym poziomie"}</h3>
      <form class="result-form">
        <label class="field">Data treningu
          <input type="date" name="date" max="${dateKey()}" value="${esc(values.date)}" required>
        </label>
        <label class="field">Wyniki serii (${level.unit})
          <input name="sets" inputmode="text" maxlength="60" placeholder="np. ${level.goal} ${level.goal} ${level.goal}" value="${esc(values.sets)}" aria-describedby="series-help" required>
          <span class="form-help" id="series-help">Oddziel serie spacją.${level.side ? " Zapisz wynik słabszej strony w każdej serii." : ""}</span>
        </label>
        ${level.load ? `<label class="field">Ciężar jednego hantla (kg)
          <input name="load" type="number" min="0.01" max="150" step="0.01" inputmode="decimal" value="${esc(values.load)}" required>
        </label>` : ""}
        <label class="field form-wide">Notatka (opcjonalnie)
          <textarea name="note" maxlength="400" placeholder="Np. zakres ruchu, opór gumy lub zapas powtórzeń">${esc(values.note)}</textarea>
        </label>
        <label class="check form-wide">
          <input name="technique" type="checkbox" ${values.technique ? "checked" : ""}> Technika zgodna z opisem ćwiczenia
        </label>
        <div class="form-error form-wide" role="alert"></div>
        <div class="form-actions form-wide">
          <button class="button primary" type="submit">${editRecord ? icon("check") : icon("plus")}${editRecord ? "Zapisz zmiany" : "Zapisz wynik"}</button>
          ${editRecord ? '<button class="button" type="button" data-delete>Usuń wynik</button>' : ""}
          <span class="form-help" role="status">${feedback}</span>
        </div>
      </form>
    </div>
  `;
}

function updateSession(index, change, errorTarget) {
  const key = dateKey(shiftDate(startOfWeek(), weekOffset * 7));
  return updateState(next => {
    const sessions = weekFor(next, key);
    sessions[index] = { ...sessions[index], ...change(sessions[index]) };
    next.weeks[key] = sessions;
  }, errorTarget);
}

main.addEventListener("click", event => {
  const control = event.target.closest("button");
  if (!control) return;
  const { skill, filter: category, offset, done, edit, exportData: backup } = control.dataset;
  if (backup !== undefined) downloadBackup();
  if (skill) openDetail(byId[skill], control);
  if (edit) {
    const record = state.records.find(item => item.id === edit);
    if (record) openDetail(byId[record.skill], control, record);
  }
  if (category) {
    filter = category;
    main.querySelectorAll("[data-filter]").forEach(button => button.setAttribute("aria-pressed", String(button === control)));
    refreshCards();
  }
  if (offset !== undefined) {
    weekOffset = Number(offset) ? weekOffset + Number(offset) : 0;
    renderPage();
    const target = main.querySelector(`[data-offset="${offset}"]:not(:disabled)`);
    (target ?? main.querySelector('[data-offset="-1"]')).focus();
  }
  if (done !== undefined && updateSession(Number(done), session => ({ done: !session.done }))) {
    renderPage();
    main.querySelector(`[data-done="${done}"]`).focus();
    showToast("Zapisano status treningu.");
  }
});

main.addEventListener("change", event => {
  if (event.target.matches("[data-sort-difficulty]")) {
    sortByDifficulty = event.target.checked;
    refreshCards();
  }
});

main.addEventListener("submit", event => {
  const form = event.target;
  if (form.matches(".import-form")) {
    event.preventDefault();
    importBackup(form);
    return;
  }
  if (!form.matches(".week-form")) return;
  event.preventDefault();
  const values = new FormData(form);
  const first = values.get("first");
  const second = values.get("second");
  const error = form.querySelector(".form-error");
  if (second === first) {
    error.textContent = "Wybierz dwie różne progresje lub pomiń drugą.";
    form.elements.second.focus();
    return;
  }
  const items = second ? [first, second] : [first];
  const saved = updateSession(Number(form.dataset.session), () => ({ day: Number(values.get("day")), items }), error);
  if (saved) {
    renderPage();
    main.querySelector(`[data-session="${form.dataset.session}"]`).closest("details").querySelector("summary").focus();
    showToast("Zapisano trening.");
  }
});

dialog.addEventListener("click", event => {
  const control = event.target.closest("button");
  if (!control) return;
  const error = dialog.querySelector(".form-error");
  if (control.hasAttribute("data-close")) dialog.close();
  if (control.dataset.level !== undefined && Number(control.dataset.level) !== selectedLevel) {
    selectedLevel = Number(control.dataset.level);
    renderDetail();
    dialog.querySelector(`[data-level="${selectedLevel}"]`).focus();
  }
  if (control.hasAttribute("data-set-level") && updateState(next => {
    next.current[selectedSkill.id] = selectedLevel;
  }, error)) {
    const draft = Object.fromEntries(new FormData(dialog.querySelector(".result-form")));
    renderPage();
    renderDetail(draft, "Zapisano aktualny poziom.");
    dialog.querySelector(`[data-level="${selectedLevel}"]`).focus();
  }
  if (control.hasAttribute("data-delete") && window.confirm("Usunąć ten wynik z historii?")) {
    if (updateState(next => { next.records = next.records.filter(record => record.id !== editRecord.id); }, error)) {
      dialog.close();
      renderPage();
      showToast("Usunięto wynik.");
    }
  }
});

dialog.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);
  const level = selectedSkill.levels[selectedLevel];
  const sets = parseSets(values.get("sets"), level.unit);
  const error = form.querySelector(".form-error");
  if (!sets) {
    error.textContent = "Podaj od 1 do 12 dodatnich liczb całkowitych oddzielonych spacjami.";
    form.elements.sets.focus();
    return;
  }
  const record = {
    id: editRecord?.id ?? globalThis.crypto.randomUUID(),
    created: editRecord?.created ?? Date.now(),
    skill: selectedSkill.id,
    level: selectedLevel,
    date: values.get("date"),
    sets,
    load: level.load ? Number(values.get("load")) : null,
    technique: values.has("technique"),
    note: values.get("note").trim(),
  };
  if (!updateState(next => {
    next.records = next.records.filter(item => item.id !== record.id);
    next.records.push(record);
  }, error)) return;
  renderPage();
  if (editRecord) {
    dialog.close();
    showToast("Zapisano zmiany w historii.");
  } else {
    renderDetail(null, "Wynik zapisany w historii.");
    dialog.querySelector('[name="sets"]').focus();
  }
});

dialog.addEventListener("close", () => {
  if (returnFocus?.isConnected) returnFocus.focus();
  else if (returnFocus) {
    const { skill, edit } = returnFocus.dataset;
    const attribute = skill ? "skill" : "edit";
    const target = main.querySelector(`[data-${attribute}="${CSS.escape(skill ?? edit ?? "")}"]`);
    (target ?? main).focus();
  }
  returnFocus = null;
});

document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});

window.addEventListener("hashchange", () => {
  if (dialog.open) dialog.close();
  renderPage();
  main.focus();
  window.scrollTo(0, 0);
});

window.addEventListener("storage", event => {
  if (event.key === storageKey || event.key === null) {
    state = readState();
    renderPage();
  }
});

document.querySelectorAll("[data-icon]").forEach(element => {
  element.innerHTML = icon(element.dataset.icon);
});
renderPage();
