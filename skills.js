import { staticSkills } from "./static-skills.js";

export const skills = [
  {
    id: "lsit", name: "L-sit", difficulty: 3, category: "core", icon: "bars", tone: "lime", gear: "Paraletki", suggested: 1,
    tip: "Na niskich paraletkach odepchnij się od uchwytów, utrzymuj proste łokcie i oddalaj barki od uszu.",
    levels: [
      { name: "Podpór ze stopami na macie", sets: 3, goal: 20, unit: "s", cue: "Unieś biodra nad matę. Stopy nadal pomagają utrzymać pozycję." },
      { name: "Naprzemienne unoszenie nogi", sets: 3, goal: 10, unit: "powt.", side: true, cue: "Z podporu unoś naprzemiennie ugięte kolana, odrywając po jednej stopie od maty. Zatrzymaj ruch na sekundę." },
      { name: "Tuck L-sit", sets: 3, goal: 15, unit: "s", cue: "Oderwij obie stopy i przyciągnij ugięte kolana. Utrzymuj biodra nad matą." },
      { name: "L-sit z jedną prostą nogą", sets: 3, goal: 10, unit: "s", side: true, cue: "Z tuck L-sit wyprostuj jedną nogę i utrzymaj uda możliwie poziomo. Zmień stronę." },
      { name: "Pełny L-sit", sets: 3, goal: 10, unit: "s", cue: "Wyprostuj obie nogi, złącz stopy i utrzymuj je mniej więcej na wysokości bioder." },
    ],
  },
  {
    id: "pushup", name: "Pompki", category: "upper", icon: "pushup", tone: "blue", gear: "Mata · opcjonalnie paraletki", suggested: 1,
    tip: "Utrzymuj tułów w jednej linii. Na paraletkach dobierz głębokość, którą kontrolujesz w barkach.",
    levels: [
      { name: "Pompki na kolanach", sets: 3, goal: 10, unit: "powt.", cue: "Opuść klatkę w kontrolowanym zakresie. Trzymaj biodra w linii między kolanami a barkami." },
      { name: "Pompki klasyczne", sets: 3, goal: 10, unit: "powt.", cue: "Ustaw dłonie na macie lub paraletkach. Zachowaj tę samą głębokość w każdym powtórzeniu." },
      { name: "Pompki z wolnym zejściem", sets: 3, goal: 8, unit: "powt.", cue: "Opuszczaj się przez 3 sekundy, zatrzymaj się na sekundę na dole i wróć do góry." },
      { name: "Pompki z gumą", sets: 3, goal: 8, unit: "powt.", cue: "Przełóż lekką gumę przez górną część pleców i przytrzymaj ją dłońmi na podłodze. Zanotuj opór gumy." },
    ],
  },
  {
    id: "pike", name: "Pike push-up", category: "upper", icon: "pike", tone: "violet", gear: "Mata · opcjonalnie paraletki", suggested: 1,
    tip: "Zacznij z biodrami wysoko. Kieruj głowę lekko przed linię dłoni i zostaw zapas zakresu, który kontrolujesz.",
    levels: [
      { name: "Pike push-up w krótkim zakresie", sets: 3, goal: 8, unit: "powt.", cue: "Zegnij łokcie do połowy dostępnego zakresu. Wróć do pełnego wyprostu ramion." },
      { name: "Pike push-up z podłogi", sets: 3, goal: 6, unit: "powt.", cue: "Ze stopami na podłodze opuszczaj głowę blisko maty, utrzymując biodra wysoko." },
      { name: "Pike push-up z pauzą", sets: 3, goal: 6, unit: "powt.", cue: "Zejdź w 3 sekundy i zatrzymaj głowę na sekundę tuż nad matą." },
      { name: "Pike push-up na paraletkach", sets: 3, goal: 6, unit: "powt.", cue: "Użyj niskich paraletek, aby stopniowo zejść głębiej. Zachowaj stabilne ustawienie uchwytów i kontrolę na całej drodze." },
    ],
  },
  {
    id: "core", name: "Core", category: "core", icon: "core", tone: "amber", gear: "Mata", suggested: 2,
    tip: "Utrzymuj żebra nad miednicą i spokojnie oddychaj. Skróć dźwignię, gdy lędźwie zaczynają odrywać się od maty.",
    levels: [
      { name: "Dead bug", sets: 3, goal: 8, unit: "powt.", side: true, cue: "Wyprostuj przeciwną rękę i nogę. Zatrzymaj ruch, zanim zmieni się ustawienie lędźwi." },
      { name: "Tuck hollow hold", sets: 3, goal: 25, unit: "s", cue: "Unieś barki i ugnij obie nogi. Utrzymuj lędźwie w kontakcie z matą." },
      { name: "Hollow hold z jedną prostą nogą", sets: 3, goal: 20, unit: "s", side: true, cue: "Wyprostuj jedną nogę, a drugą zostaw ugiętą. Dobierz wysokość nogi do utrzymania pozycji." },
      { name: "Pełny hollow hold", sets: 3, goal: 25, unit: "s", cue: "Wyprostuj obie nogi i wydłuż ramiona za głową. Utrzymaj lędźwie na macie i tempo oddechu." },
    ],
  },
  {
    id: "legs", name: "Nogi", category: "legs", icon: "legs", tone: "rose", gear: "Hantle · mata", suggested: 1,
    tip: "Ta progresja rozwija przysiad jednonóż w wykroku. RDL jednonóż możesz nadal wykonywać w swoim planie jako ćwiczenie biodra.",
    levels: [
      { name: "Przysiad z hantlem (goblet)", sets: 3, goal: 10, unit: "powt.", load: true, cue: "Trzymaj hantel przy klatce. Schodź do głębokości, na której utrzymujesz całe stopy stabilnie." },
      { name: "Przysiad w wykroku", sets: 3, goal: 10, unit: "powt.", side: true, cue: "Ustaw stopy w wykroku i utrzymuj je w miejscu. Opuść tylne kolano w stronę maty." },
      { name: "Przysiad w wykroku z hantlami", sets: 3, goal: 10, unit: "powt.", side: true, load: true, cue: "Trzymaj po jednym hantlu w każdej dłoni. Zachowaj ten sam zakres po obu stronach." },
      { name: "Przysiad w wykroku z pauzą", sets: 3, goal: 8, unit: "powt.", side: true, load: true, cue: "Użyj hantli i zatrzymaj się na 2 sekundy tuż nad matą. Po osiągnięciu celu zwiększ obciążenie o dostępny mały krok." },
    ],
  },
  {
    id: "back", name: "Plecy z hantlami", category: "upper", icon: "dumbbell", tone: "mint", gear: "Hantle · bez ławeczki", suggested: 0,
    tip: "W wiosłowaniu oprzyj wolną dłoń o własne udo. Utrzymuj tułów stabilnie i dobierz obciążenie, przy którym unikasz skrętu.",
    levels: [
      { name: "Wiosłowanie jednorącz z podparciem", sets: 3, goal: 10, unit: "powt.", side: true, load: true, cue: "Prowadź łokieć blisko ciała w stronę biodra. Opuszczaj hantel spokojnie." },
      { name: "Wiosłowanie z pauzą", sets: 3, goal: 10, unit: "powt.", side: true, load: true, cue: "Zatrzymaj hantel na 2 sekundy na górze bez unoszenia barku w stronę ucha." },
      { name: "Wiosłowanie z wolnym opuszczaniem", sets: 3, goal: 8, unit: "powt.", side: true, load: true, cue: "Opuszczaj hantel przez 3 sekundy. Utrzymuj jednakowy kąt tułowia i zakres po obu stronach." },
      { name: "Wiosłowanie z większym ciężarem", sets: 3, goal: 8, unit: "powt.", side: true, load: true, cue: "Zwiększ obciążenie o najmniejszy dostępny krok. Po osiągnięciu celu ponownie zwiększ ciężar lub wydłuż pauzę." },
    ],
  },
];

export const catalog = [...skills, ...staticSkills];
export const byId = Object.fromEntries(catalog.map(skill => [skill.id, skill]));
export const categories = { all: "Wszystkie", upper: "Góra ciała", legs: "Nogi", core: "Core" };
