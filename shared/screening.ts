/**
 * ASRS v1.1 (Adult ADHD Self-Report Scale) Screening Logic
 * WHO-compliant ADHD assessment tool
 * Reference: https://www.nice.org.uk/guidance/ng87
 */

export interface ASRSQuestion {
  id: number;
  text: string;
  category: "partA" | "partB";
  scoringLogic: "threshold3" | "threshold4"; // threshold3: >= 3 counts; threshold4: >= 4 counts
}

export const ASRS_QUESTIONS: ASRSQuestion[] = [
  // Part A - Most Predictive (6 questions)
  {
    id: 1,
    text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    category: "partA",
    scoringLogic: "threshold3", // Q1-Q3: 'Sometimes' (3) or higher
  },
  {
    id: 2,
    text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    category: "partA",
    scoringLogic: "threshold3",
  },
  {
    id: 3,
    text: "How often do you have problems remembering appointments or obligations?",
    category: "partA",
    scoringLogic: "threshold3",
  },
  {
    id: 4,
    text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    category: "partA",
    scoringLogic: "threshold4", // Q4-Q6: 'Often' (4) or higher
  },
  {
    id: 5,
    text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    category: "partA",
    scoringLogic: "threshold4",
  },
  {
    id: 6,
    text: "How often do you feel overly active and compelled to do things, as if you were driven by a motor?",
    category: "partA",
    scoringLogic: "threshold4",
  },
];

export const LIKERT_OPTIONS = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Very Often" },
];

export type LikertResponse = 1 | 2 | 3 | 4 | 5;

export interface ScreeningScore {
  partAScore: number; // 0-6 positive indicators
  likelihood: "Low" | "Moderate" | "High";
  message: string;
}

/**
 * Calculate ASRS v1.1 Part A score based on NICE/WHO guidelines
 * Part A has 6 questions with specific scoring thresholds
 * Score >= 4 indicates symptoms highly consistent with adult ADHD
 */
export function calculateASRSScore(responses: Record<number, LikertResponse>): ScreeningScore {
  let partAScore = 0;

  // Score each question according to its threshold
  ASRS_QUESTIONS.forEach((q) => {
    const response = responses[q.id];
    if (!response) return;

    if (q.scoringLogic === "threshold3" && response >= 3) {
      partAScore += 1;
    } else if (q.scoringLogic === "threshold4" && response >= 4) {
      partAScore += 1;
    }
  });

  // Determine likelihood based on NICE guidelines
  let likelihood: "Low" | "Moderate" | "High" = "Low";
  let message = "Your symptoms do not currently align strongly with adult ADHD according to the ASRS v1.1 criteria.";

  if (partAScore >= 4) {
    likelihood = "High";
    message =
      "Your responses are highly consistent with adult ADHD. This warrants further clinical assessment by a specialist.";
  } else if (partAScore >= 2) {
    likelihood = "Moderate";
    message = "You have some symptoms of ADHD. A formal clinical review is recommended if these impact your daily life.";
  }

  return { partAScore, likelihood, message };
}

/**
 * Validate that all 6 Part A questions have been answered
 */
export function isScreeningComplete(responses: Record<number, LikertResponse>): boolean {
  return ASRS_QUESTIONS.every((q) => responses[q.id] !== undefined);
}
