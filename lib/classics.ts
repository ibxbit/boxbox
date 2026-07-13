// Curated "Top 10 of all time" shown on the home page. Embedded so the
// homepage hero never depends on the API being up.

export interface ClassicRace {
  season: string;
  round: string;
  title: string;
  country: string;
  score: number;
  blurb: string;
  wiki: string;
  // Local poster image from public/image, matched to the race's story.
  image: string;
}

export const CLASSICS: ClassicRace[] = [
  {
    season: "2008", round: "18", title: "Brazilian GP 2008", country: "Brazil",
    score: 97, blurb: "Is that Glock?! Hamilton snatches the title at the last corner of the last lap.",
    wiki: "2008_Brazilian_Grand_Prix",
    image: "/image/f2.jpg",
  },
  {
    season: "2011", round: "7", title: "Canadian GP 2011", country: "Canada",
    score: 96, blurb: "Button from last to first in the rain — the longest, wildest race in F1 history.",
    wiki: "2011_Canadian_Grand_Prix",
    image: "/image/f16.avif",
  },
  {
    season: "2005", round: "18", title: "Japanese GP 2005", country: "Japan",
    score: 95, blurb: "Räikkönen hunts down Fisichella and passes him into turn 1 on the final lap.",
    wiki: "2005_Japanese_Grand_Prix",
    image: "/image/f7.webp",
  },
  {
    season: "2012", round: "20", title: "Brazilian GP 2012", country: "Brazil",
    score: 95, blurb: "Vettel spun to last on lap 1, fights back through chaos to beat Alonso to the crown.",
    wiki: "2012_Brazilian_Grand_Prix",
    image: "/image/f5.jpg",
  },
  {
    season: "2019", round: "11", title: "German GP 2019", country: "Germany",
    score: 94, blurb: "Hockenheim havoc — rain, gravel, and a stunning Verstappen win as Mercedes implodes.",
    wiki: "2019_German_Grand_Prix",
    image: "/image/f6.jpeg",
  },
  {
    season: "2014", round: "3", title: "Bahrain GP 2014", country: "Bahrain",
    score: 93, blurb: "The Duel in the Desert — Hamilton and Rosberg wheel-to-wheel under the lights.",
    wiki: "2014_Bahrain_Grand_Prix",
    image: "/image/f1.jpg",
  },
  {
    season: "2020", round: "8", title: "Italian GP 2020", country: "Italy",
    score: 93, blurb: "Gasly shocks the world at Monza in a race turned upside down by a red flag.",
    wiki: "2020_Italian_Grand_Prix",
    image: "/image/f4.jpg",
  },
  {
    season: "2021", round: "22", title: "Abu Dhabi GP 2021", country: "UAE",
    score: 92, blurb: "The most controversial finale ever — Verstappen vs Hamilton, decided on the last lap.",
    wiki: "2021_Abu_Dhabi_Grand_Prix",
    image: "/image/f3.jpg",
  },
  {
    season: "1998", round: "13", title: "Belgian GP 1998", country: "Belgium",
    score: 91, blurb: "A 13-car pile-up, Schumacher punching Coulthard's garage, and a Jordan 1-2 in the storm.",
    wiki: "1998_Belgian_Grand_Prix",
    image: "/image/f8.webp",
  },
  {
    season: "2007", round: "10", title: "European GP 2007", country: "Germany",
    score: 90, blurb: "A river across turn 1, Winkelhock leading in a Spyker, Alonso wins a soaked thriller.",
    wiki: "2007_European_Grand_Prix",
    image: "/image/f11.jpg",
  },
];
