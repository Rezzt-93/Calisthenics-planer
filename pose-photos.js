const commons = "https://commons.wikimedia.org/wiki/File:";
function photo(file, author, license, alt) {
  return { source: commons + encodeURIComponent(file), author, license, alt };
}

export const photos = {
  "side-plank": photo("Side_Plank.jpg", "Jaykayfit", "by-sa/3.0", "Podpór bokiem na przedramieniu z prostymi nogami i uniesionymi biodrami."),
  frog: photo("Kakasana_Yoga-Asana_Nina-Mel.jpg", "Kennguru", "by/3.0", "Balans na dłoniach z ugiętymi łokciami, kolanami opartymi o ramiona i stopami w powietrzu."),
  lsit: photo("Figura_L-Sit_na_paraletkach.jpg", "BandiSW", "by-sa/4.0", "Podpór na niskich paraletkach z wyprostowanymi nogami przed tułowiem."),
  handstand: photo("Handstand_beach.jpg", "Joy ndr", "by-sa/4.0", "Wolne stanie na dwóch rękach z nogami złączonymi nad biodrami i barkami."),
  "dragon-flag": { alt: "Sylwetka nad ławką z prostymi, złączonymi nogami i dłońmi chwytającymi uchwyt za głową." },
  "back-lever": photo("Back_lever_on_gymnastics_rings.jpg", "Ondra7575", "by-sa/4.0", "Poziomy zwis na kółkach twarzą w dół, z prostymi nogami i ramionami."),
  "front-lever": photo("John_Gill_-_Front_Lever_-_1962.JPG", "Silentrunner", "by-sa/3.0", "Poziomy zwis pod drążkiem z klatką skierowaną do góry i wyprostowanymi ramionami."),
  "human-flag": photo("Human_Flag_von_Sven_Kohl_(Calisthenic_Movement),_2013.jpg", "Daniel Kaiser", "by-sa/3.0", "Ciało poziomo obok drabinki, ręce chwytają dwa szczeble na różnych wysokościach."),
  planche: photo("Planche.jpg", "Jonathanfv", "by/3.0", "Poziomy podpór na prostych rękach, z wyprostowanymi nogami w powietrzu."),
};
