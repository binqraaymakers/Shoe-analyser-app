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
  normalizedScore: number; // 0–100
  secPerKmDelta: number; // positive = faster than average
  explanation: string;
  rank: number;
  isBestMatch: boolean;
}

// ─── Layer 1: Base shoe score ─────────────────────────────────────────────────
// Represents intrinsic shoe quality, independent of runner context.
// Weights sum to 1.0 before the carbon bonus and weight penalty.
export function calculateBaseScore(shoe: Shoe): number {
  const reboundContrib = shoe.rebound * 0.35;
  const cushioningContrib = shoe.cushioning * 0.30;
  const stabilityContrib = shoe.stability * 0.20;
  const carbonBonus = shoe.carbonPlate ? 4 : 0;
  // Weight penalty: normalised around 250 g — heavier = minor penalty
  const weightPenalty = (shoe.weight - 250) * 0.008;

  return reboundContrib + cushioningContrib + stabilityContrib + carbonBonus - weightPenalty;
}

// ─── Layer 2: Context weights ─────────────────────────────────────────────────
// Returns per-attribute multipliers that shift continuously with pace & distance.
// No hard category switches — values interpolate smoothly.
export interface ContextWeights {
  rebound: number;
  cushioning: number;
  stability: number;
  carbon: number;
}

export function getContextWeights(profile: RunnerProfile): ContextWeights {
  const { pace, distance } = profile;

  // Pace influence: fast (<4:30) → speed-biased; slow (>5:30) → comfort-biased
  // We map pace linearly onto a 0–1 "comfort factor" between those bounds.
  const FAST_PACE = 4.5;  // 4:30 min/km
  const SLOW_PACE = 5.5;  // 5:30 min/km
  const comfortFactor = Math.max(0, Math.min(1, (pace - FAST_PACE) / (SLOW_PACE - FAST_PACE)));
  // comfortFactor = 0 at fast pace, 1 at slow pace

  const weights: ContextWeights = {
    // Fast runners benefit more from rebound; slow runners less
    rebound: 1.4 - comfortFactor * 0.6,        // 1.4 → 0.8
    // Slow runners benefit more from cushioning; fast runners less
    cushioning: 0.8 + comfortFactor * 0.6,     // 0.8 → 1.4
    // Stability matters more for slower / heavier impact patterns
    stability: 0.8 + comfortFactor * 0.5,      // 0.8 → 1.3
    // Carbon plate value peaks for fast runners, tapers but never disappears
    carbon: 1.5 - comfortFactor * 0.7,         // 1.5 → 0.8
  };

  // Distance fine-tuning (additive shifts on top of pace weights)
  if (distance === "5K") {
    weights.rebound += 0.15;
    weights.carbon += 0.1;
    weights.cushioning -= 0.1;
  } else if (distance === "marathon") {
    weights.cushioning += 0.2;
    weights.stability += 0.1;
    weights.rebound -= 0.1;
  }
  // 10K stays neutral; half adds a tiny endurance nudge
  if (distance === "half") {
    weights.cushioning += 0.05;
  }

  // Experience modifier: beginners lean on stability; advanced runners on raw speed
  if (profile.experience === "beginner") {
    weights.stability += 0.2;
    weights.cushioning += 0.1;
  } else if (profile.experience === "advanced") {
    weights.rebound += 0.1;
    weights.carbon += 0.1;
  }

  return weights;
}

// ─── Final score ──────────────────────────────────────────────────────────────
// Applies context weights to the base attributes, then subtracts a runner-weight
// penalty (heavier runner → shoe weight matters more).
export function calculateFinalScore(shoe: Shoe, profile: RunnerProfile): number {
  const w = getContextWeights(profile);

  const score =
    shoe.rebound * w.rebound * 0.35 +
    shoe.cushioning * w.cushioning * 0.30 +
    shoe.stability * w.stability * 0.20 +
    (shoe.carbonPlate ? 4 * w.carbon : 0) -
    (shoe.weight / 1000) * (1 + profile.weight * 0.005); // kg → penalty scaled by runner mass

  return score;
}

// ─── Explanation generator ────────────────────────────────────────────────────
function generateExplanation(shoe: Shoe, profile: RunnerProfile, weights: ContextWeights): string {
  const { pace, distance, experience, weight: runnerWeight } = profile;
  const distanceLabel: Record<Distance, string> = {
    "5K": "5 km",
    "10K": "10 km",
    half: "halve marathon",
    marathon: "marathon",
  };
  const dist = distanceLabel[distance];
  const paceStr = formatPace(pace);

  // Carbon plate + fast pace
  if (shoe.carbonPlate && pace < 4.5) {
    return `Bij jouw snelle tempo van ${paceStr}/km haalt de koolstofplaat in de ${shoe.model} het maximale uit elke stap. De hoge rebound (${shoe.rebound}/10) en propulsie verlagen direct je energieverbruik over ${dist}.`;
  }

  // Carbon plate + marathon
  if (shoe.carbonPlate && distance === "marathon") {
    return `Over een marathon accumuleert elk voordeel. De koolstofplaat van de ${shoe.model} bespaart energie per stap — bij 42 km loopt dat op tot merkbaar tijdsverschil, ook voor jouw tempo van ${paceStr}/km.`;
  }

  // Extreme cushioning + slow pace + marathon
  if (shoe.cushioning >= 9 && pace > 5.3 && distance === "marathon") {
    return `De uitzonderlijke demping (${shoe.cushioning}/10) van de ${shoe.model} is precies wat jij nodig hebt op een marathon bij tempo ${paceStr}/km. Beschermt je gewrichten in de laatste 15 km wanneer vermoeidheid toeslaat.`;
  }

  // High rebound + 5K
  if (shoe.rebound >= 9 && distance === "5K") {
    return `Voor een 5K is explosieve terugstoot cruciaal. De ${shoe.model} scoort ${shoe.rebound}/10 op rebound en vertaalt dat direct in propulsie, ideaal voor jouw streven naar een snelle tijd.`;
  }

  // Beginner + stability
  if (experience === "beginner" && shoe.stability >= 8) {
    return `Als beginner profiteer je sterk van de stabiliteit (${shoe.stability}/10) in de ${shoe.model}. De schoen ondersteunt een natuurlijke looptechniek en verkleint blessurerisico bij opbouw van je kilometerstand.`;
  }

  // High runner weight + cushioning
  if (runnerWeight > 85 && shoe.cushioning >= 9) {
    return `Met ${runnerWeight} kg is impactabsorptie essentieel. De demping van ${shoe.cushioning}/10 in de ${shoe.model} verdeelt de krachten optimaal, waardoor je gewrichten beschermd blijven over ${dist}.`;
  }

  // Lightweight race shoe + not carbon
  if (shoe.weight <= 200 && !shoe.carbonPlate) {
    return `De ${shoe.model} weegt slechts ${shoe.weight} g — dat lage gewicht verlaagt je energieverbruik bij elke stap en geeft je vrijheid op ${dist} zonder carbon-prijskaartje.`;
  }

  // Balanced mid-pace shoe
  if (pace >= 4.5 && pace <= 5.5 && shoe.rebound >= 7 && shoe.cushioning >= 7) {
    return `Jouw tempo (${paceStr}/km) vraagt om een balans tussen responsiviteit en comfort. De ${shoe.model} combineert rebound ${shoe.rebound}/10 met demping ${shoe.cushioning}/10 — precies dat evenwicht.`;
  }

  // High stability + half/marathon
  if (shoe.stability >= 9 && (distance === "half" || distance === "marathon")) {
    return `Lange afstanden belasten je voeten asymmetrisch bij vermoeidheid. De hoge stabiliteit (${shoe.stability}/10) van de ${shoe.model} houdt jouw voetstand in check tot de finish van ${dist}.`;
  }

  // Generic fallback with context
  const dominantWeight = weights.rebound > weights.cushioning ? "rebound" : "demping";
  return `Op basis van jouw profiel (${paceStr}/km, ${dist}, ${experience}) weegt ${dominantWeight} het zwaarst. De ${shoe.model} scoort ${dominantWeight === "rebound" ? shoe.rebound : shoe.cushioning}/10 op dat vlak en past daardoor goed bij jou.`;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function formatPace(pace: number): string {
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function parsePace(raw: string): number {
  if (raw.includes(":")) {
    const [min, sec] = raw.split(":").map(Number);
    return min + sec / 60;
  }
  return parseFloat(raw);
}

export function rankShoes(shoes: Shoe[], profile: RunnerProfile): ShoeResult[] {
  const weights = getContextWeights(profile);

  const scored = shoes.map((shoe) => ({
    ...shoe,
    score: calculateFinalScore(shoe, profile),
  }));

  const scores = scored.map((s) => s.score);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const scoreRange = maxScore - minScore || 1;

  const sorted = scored
    .sort((a, b) => b.score - a.score)
    .map((shoe, idx) => {
      // Map to 30–100 range so even the worst shoe shows a meaningful score
      const normalizedScore = Math.round(((shoe.score - minScore) / scoreRange) * 70 + 30);
      // sec/km delta: best shoe = +8 s/km faster, worst = -8 s/km slower vs median
      const scoreRatio = (shoe.score - minScore) / scoreRange;
      const secPerKmDelta = parseFloat(((scoreRatio - 0.5) * 16).toFixed(1));

      return {
        ...shoe,
        normalizedScore,
        secPerKmDelta,
        explanation: generateExplanation(shoe, profile, weights),
        rank: idx + 1,
        isBestMatch: idx === 0,
      };
    });

  return sorted;
}
