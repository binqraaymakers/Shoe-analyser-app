import { Shoe } from "./shoes";

export type Distance = "5K" | "10K" | "half" | "marathon";
export type Experience = "beginner" | "intermediate" | "advanced";

export interface RunnerProfile {
  weight: number; // kg
  pace: number; // min/km as decimal (e.g. 4.5 = 4:30)
  distance: Distance;
  experience: Experience;
}

export interface ShoeResult extends Shoe {
  score: number;
  normalizedScore: number; // 0-100
  secPerKmDelta: number; // positive = faster, negative = slower
  explanation: string;
  rank: number;
  isBestMatch: boolean;
}

function parsePaceString(paceStr: string): number {
  // Accepts "4:30" -> 4.5 or plain number string
  if (paceStr.includes(":")) {
    const [min, sec] = paceStr.split(":").map(Number);
    return min + sec / 60;
  }
  return parseFloat(paceStr);
}

export function calculateScore(shoe: Shoe, profile: RunnerProfile): number {
  const { weight: runnerWeight, pace, distance } = profile;

  let score =
    shoe.rebound * 0.3 +
    shoe.cushioning * 0.25 +
    shoe.stability * 0.2 +
    (shoe.carbonPlate ? 3 : 0) -
    shoe.weight * 0.02 -
    runnerWeight * 0.01;

  // Pace modifiers
  if (pace < 4.5) {
    // faster than 4:30/km
    if (shoe.carbonPlate) score += 3;
  } else if (pace <= 5.5) {
    // 4:30 – 5:30
    score += 1;
  } else {
    // slower than 5:30
    if (shoe.cushioning >= 8) score += 2;
  }

  // Distance modifiers
  if (distance === "5K") {
    if (shoe.rebound >= 9) score += 2;
  } else if (distance === "marathon") {
    if (shoe.cushioning >= 8) score += 3;
  }

  // Experience modifiers
  if (profile.experience === "beginner") {
    if (shoe.stability >= 8) score += 1.5;
    if (shoe.cushioning >= 9) score += 1;
  } else if (profile.experience === "advanced") {
    if (shoe.carbonPlate) score += 1;
    if (shoe.rebound >= 9) score += 0.5;
  }

  return score;
}

function generateExplanation(shoe: Shoe, profile: RunnerProfile, rank: number): string {
  const { pace, distance, experience, weight: runnerWeight } = profile;
  const distanceLabel: Record<Distance, string> = {
    "5K": "5 km",
    "10K": "10 km",
    half: "halve marathon",
    marathon: "marathon",
  };

  if (shoe.carbonPlate && pace < 4.5) {
    return `Met een tempo onder 4:30/km profiteer je maximaal van de koolstofplaat in deze ${shoe.model}. De explosieve terugstoot versnelt je cadans en bespaart energie over ${distanceLabel[distance]}.`;
  }

  if (shoe.cushioning >= 9 && distance === "marathon") {
    return `Voor een marathon is demping cruciaal. De ${shoe.model} biedt uitstekende schokabsorptie die je spieren en gewrichten beschermt over de volledige 42 km.`;
  }

  if (shoe.rebound >= 9 && distance === "5K") {
    return `Bij een 5K draait alles om snelheid. De hoge rebound van de ${shoe.model} geeft je extra propulsie per stap, ideaal voor jouw tempo van ${formatPace(pace)}/km.`;
  }

  if (experience === "beginner" && shoe.stability >= 8) {
    return `Als beginner biedt de ${shoe.model} de stabiliteit en ondersteuning die je nodig hebt om correct te landen, blessures te voorkomen en comfortabel te bouwen aan je loopbasis.`;
  }

  if (shoe.carbonPlate && distance === "half") {
    return `Voor een halve marathon combineert de ${shoe.model} energieterugstoot via de koolstofplaat met voldoende demping. Een slimme keuze als je een PR nastreeft.`;
  }

  if (runnerWeight > 85 && shoe.cushioning >= 9) {
    return `Met jouw lichaamsgewicht is goede demping essentieel. De ${shoe.model} verdeelt de impact optimaal en houdt je gewrichten beschermd gedurende de hele ${distanceLabel[distance]}.`;
  }

  if (shoe.category === "all-around") {
    return `De ${shoe.model} is een veelzijdige schoen die balans biedt tussen snelheid, comfort en stabiliteit – perfect voor jouw mixed trainingsprogramma en ${distanceLabel[distance]}.`;
  }

  if (shoe.category === "easy") {
    return `De ${shoe.model} is ontworpen voor herstelrondes en lange duurlopen. De zachte demping beschermt je lichaam op eenvoudigere trainingsdagen.`;
  }

  if (pace > 5.5) {
    return `Voor jouw tempo biedt de ${shoe.model} een uitstekende balans van comfort en ondersteuning, zodat je efficiënt loopt zonder onnodige vermoeidheid over ${distanceLabel[distance]}.`;
  }

  return `De ${shoe.model} scoort goed op jouw profiel dankzij de combinatie van rebound (${shoe.rebound}/10), demping (${shoe.cushioning}/10) en stabiliteit (${shoe.stability}/10), afgestemd op ${distanceLabel[distance]}.`;
}

export function formatPace(pace: number): string {
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function rankShoes(shoes: Shoe[], profile: RunnerProfile): ShoeResult[] {
  const scored = shoes.map((shoe) => ({
    ...shoe,
    score: calculateScore(shoe, profile),
  }));

  const maxScore = Math.max(...scored.map((s) => s.score));
  const minScore = Math.min(...scored.map((s) => s.score));
  const scoreRange = maxScore - minScore || 1;

  const sorted = scored
    .sort((a, b) => b.score - a.score)
    .map((shoe, idx) => {
      const normalizedScore = Math.round(((shoe.score - minScore) / scoreRange) * 70 + 30);
      // Estimate sec/km delta: top shoe = -8 sec/km, bottom = +8 sec/km relative to median
      const scoreRatio = (shoe.score - minScore) / scoreRange;
      const secPerKmDelta = parseFloat(((scoreRatio - 0.5) * 16).toFixed(1));

      return {
        ...shoe,
        normalizedScore,
        secPerKmDelta,
        explanation: generateExplanation(shoe, profile, idx + 1),
        rank: idx + 1,
        isBestMatch: idx === 0,
      };
    });

  return sorted;
}

export function parsePace(raw: string): number {
  return parsePaceString(raw);
}
