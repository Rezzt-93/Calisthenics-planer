export const difficulties = {
  1: "Podstawowa",
  2: "Umiarkowana",
  3: "Wysoka",
  4: "Bardzo wysoka",
  5: "Ekspercka",
};

function hold(name, goal, cue, equipment, side = false) {
  return { name, sets: 3, goal, unit: "s", cue, equipment, side };
}

const mat = "Mata";
const bars = "Niskie paraletki";
const wall = "Mata i wolna ściana";
const pullupBar = "Stabilny drążek z miejscem na pełny zwis i obrót";
const flagPole = "Stabilny pionowy słup lub drabinka treningowa";
const anchor = "Pewny, nieruchomy chwyt za głową, np. stały element stanowiska treningowego";

export const staticSkills = [
  {
    id: "side-plank", category: "core", name: "Side plank", difficulty: 1, icon: "core", tone: "amber", gear: mat,
    tip: "Statyczny podpór bokiem. Ustaw łokieć pod barkiem i zapisuj krótszy czas z obu stron.",
    levels: [
      hold("Podpór bokiem na ugiętych kolanach", 20, "Unieś biodra i ustaw bark, biodro oraz kolano w jednej linii.", mat, true),
      hold("Podpór bokiem ze stopami w wykroku", 20, "Wyprostuj nogi i oprzyj górną stopę przed dolną dla stabilności.", mat, true),
      hold("Pełny side plank", 30, "Ustaw stopy jedna na drugiej. Utrzymuj biodra nad matą, a klatkę skierowaną w bok.", mat, true),
    ],
  },
  {
    id: "frog", category: "upper", name: "Frog stand", difficulty: 2, icon: "bars", tone: "mint", gear: "Mata · opcjonalnie paraletki",
    tip: "Balans na dłoniach z kolanami opartymi o ramiona i ugiętymi łokciami.",
    levels: [
      hold("Przeniesienie ciężaru na dłonie", 15, "Oprzyj kolana o ramiona. Przenieś ciężar w przód, zostawiając palce obu stóp na macie.", mat),
      hold("Frog stand z jedną stopą uniesioną", 10, "Oderwij jedną stopę. Utrzymaj pozycję, a potem zmień stronę.", mat, true),
      hold("Pełny frog stand", 15, "Oderwij obie stopy. Utrzymuj ciężar nad dłońmi, kolana na ramionach i wzrok przed dłońmi.", mat),
    ],
  },
  {
    id: "handstand", category: "upper", name: "Handstand", difficulty: 3, icon: "pike", tone: "violet", gear: "Podłoga · ściana na początku",
    tip: "Cel to wolne stanie na dwóch rękach. Zanim oderwiesz stopy od ściany, przećwicz spokojne zejście z podporu.",
    levels: [
      hold("Pike hold", 25, "Na dłoniach i stopach unieś biodra. Odepchnij podłogę prostymi rękami i utrzymuj napięcie tułowia.", mat),
      hold("Stanie brzuchem do ściany", 25, "Podejdź do ściany na tyle blisko, na ile możesz spokojnie wejść i zejść. Wypchnij barki i zbliż żebra do miednicy.", wall),
      hold("Balans przy ścianie", 5, "Przenieś ciężar nad dłonie i delikatnie oderwij obie stopy, utrzymując prostą sylwetkę.", wall),
      hold("Wolne stanie na rękach", 10, "Ustaw biodra nad barkami i dłońmi. Trzymaj nogi razem i koryguj balans palcami dłoni.", "Równa podłoga i wolna przestrzeń do zejścia"),
    ],
  },
  {
    id: "dragon-flag", category: "core", name: "Dragon flag", difficulty: 4, icon: "core", tone: "amber", gear: "Mata do bazy · stały chwyt do figury",
    tip: "Utrzymujesz prostą sylwetkę nad podłożem, opierając ciężar na górnej części pleców. Do właściwej figury potrzebujesz stabilnego chwytu za głową.",
    levels: [
      hold("Przygotowanie · hollow hold", 25, "Utrzymuj lędźwie na macie. Dobierz ustawienie nóg i ramion tak, żeby cały czas kontrolować miednicę.", mat),
      hold("Tuck dragon flag", 12, "Złap stały element za głową. Unieś biodra z ugiętymi kolanami, opierając ciężar na górnej części pleców i odciążając szyję.", anchor),
      hold("Dragon flag z jedną prostą nogą", 8, "Zachowaj linię od barków przez biodra do pięty prostej nogi. Drugą nogę trzymaj ugiętą.", anchor, true),
      hold("Pełny dragon flag", 8, "Wyprostuj i złącz nogi. Utrzymuj ciało w jednej linii nisko nad podłożem, z podparciem na górnej części pleców.", anchor),
    ],
  },
  {
    id: "back-lever", category: "upper", name: "Back lever", difficulty: 4, icon: "bars", tone: "blue", gear: "Mata do bazy · drążek do figury",
    tip: "Poziomy zwis z klatką skierowaną do ziemi. Ucz się kontrolowanego wejścia i powrotu w dostępnym zakresie barków.",
    levels: [
      hold("Przygotowanie · podpór tyłem", 25, "Oprzyj dłonie za biodrami. Wypchnij biodra i utrzymuj prosty tułów w kontrolowanym zakresie barków.", mat),
      hold("Tuck back lever", 10, "Z kontrolowanej pozycji odwróconej zegnij biodra i kolana. Zatrzymaj plecy poziomo, utrzymując wyprostowane łokcie.", pullupBar),
      hold("Back lever w rozkroku", 8, "Wyprostuj nogi w rozkroku, kierując klatkę do ziemi. Utrzymuj biodra na wysokości barków.", pullupBar),
      hold("Pełny back lever", 8, "Złącz proste nogi. Utrzymuj ciało poziomo, twarzą do dołu i z prostymi ramionami.", pullupBar),
    ],
  },
  {
    id: "front-lever", category: "upper", name: "Front lever", difficulty: 4, icon: "bars", tone: "blue", gear: "Mata do bazy · drążek do figury",
    tip: "Poziomy zwis z klatką skierowaną do góry. Pełna figura wymaga drążka. Wiosłowanie hantlem może wspierać bazę siłową pleców.",
    levels: [
      hold("Przygotowanie · hollow hold", 25, "Dociśnij lędźwie do maty i utrzymaj prostą linię nóg w zakresie, w którym kontrolujesz miednicę.", mat),
      hold("Tuck front lever", 12, "Przyciągnij kolana do klatki. Z prostymi łokciami unieś biodra tak, by tułów znalazł się poziomo.", pullupBar),
      hold("Advanced tuck front lever", 10, "Odsuń kolana od klatki i utrzymuj płaskie, poziome plecy z prostymi ramionami.", pullupBar),
      hold("Front lever w rozkroku", 8, "Wyprostuj nogi w rozkroku i utrzymuj biodra na wysokości barków.", pullupBar),
      hold("Pełny front lever", 8, "Złącz proste nogi i utrzymaj ciało poziomo, klatką do góry, z prostymi ramionami.", pullupBar),
    ],
  },
  {
    id: "human-flag", category: "upper", name: "Human flag", difficulty: 5, icon: "bars", tone: "rose", gear: "Mata do bazy · słup lub drabinka do figury",
    tip: "Ciało utrzymujesz poziomo bokiem do słupa. Górna ręka ciągnie, dolna odpycha. Ćwicz i zapisuj wynik po obu stronach.",
    levels: [
      hold("Przygotowanie · side plank", 30, "Trzymaj bark nad łokciem i biodra wysoko. Wykonaj tę samą pozycję po obu stronach.", mat, true),
      hold("Podpór bokiem przy słupie", 15, "Zostaw stopy na ziemi. Odepchnij się dolną ręką i przyciągnij górną, utrzymując tułów stabilnie.", flagPole, true),
      hold("Tuck human flag", 8, "Oderwij stopy od ziemi. Ugnij kolana, utrzymując tułów poziomo i ręce proste.", flagPole, true),
      hold("Human flag w rozkroku", 8, "Wyprostuj nogi w rozkroku. Skieruj biodra w bok i utrzymaj tułów poziomo.", flagPole, true),
      hold("Pełny human flag", 6, "Złącz proste nogi. Utrzymuj linię od barków do stóp równolegle do podłoża.", flagPole, true),
    ],
  },
  {
    id: "planche", category: "upper", name: "Planche", difficulty: 5, icon: "pushup", tone: "lime", gear: bars,
    tip: "Tułów i nogi są poziomo nad ziemią na prostych ramionach. Na niskich paraletkach możesz trzymać nadgarstki w neutralnej pozycji.",
    levels: [
      hold("Planche lean", 15, "Odepchnij uchwyty prostymi rękami. Przenieś barki przed dłonie, zostawiając stopy na podłożu.", bars),
      hold("Tuck planche", 10, "Z prostymi łokciami oderwij stopy, przyciągnij kolana do klatki i utrzymuj biodra mniej więcej na wysokości barków.", bars),
      hold("Advanced tuck planche", 8, "Odsuń kolana od klatki. Wydłuż tułów i utrzymuj proste łokcie.", bars),
      hold("Straddle planche", 8, "Wyprostuj nogi w rozkroku. Utrzymuj ciało poziomo i aktywnie odpychaj uchwyty.", bars),
      hold("Pełna planche", 6, "Złącz wyprostowane nogi. Utrzymuj prostą linię od barków do stóp, wspierając się na prostych rękach.", bars),
    ],
  },
].map(skill => ({ ...skill, suggested: 0 }));
