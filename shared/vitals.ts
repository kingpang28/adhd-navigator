/**
 * Vitals Assessment & Medication Readiness
 * Based on NICE guidelines for ADHD medication initiation
 * Reference: https://www.nice.org.uk/guidance/ng87
 */

export interface VitalsReading {
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  heartRate: number; // BPM
}

export interface VitalsAssessment {
  medicationReadiness: "Ready" | "Requires Review";
  flags: string[];
  recommendations: string[];
}

/**
 * NICE Guidelines Thresholds for Medication Readiness
 * Stimulant medications require baseline vitals within safe ranges
 */
const VITALS_THRESHOLDS = {
  systolicBP_MAX: 140, // mmHg - Stage 2 hypertension threshold
  diastolicBP_MAX: 90, // mmHg - Stage 2 hypertension threshold
  heartRate_MAX: 100, // BPM - Tachycardia threshold
};

/**
 * Assess vitals against NICE guidelines for medication readiness
 * Returns medication readiness status and any clinical flags
 */
export function assessMedicationReadiness(vitals: VitalsReading): VitalsAssessment {
  const flags: string[] = [];
  const recommendations: string[] = [];

  // Check systolic BP
  if (vitals.systolicBP >= VITALS_THRESHOLDS.systolicBP_MAX) {
    flags.push(`Systolic BP elevated (${vitals.systolicBP} mmHg ≥ 140 mmHg)`);
    recommendations.push("Discuss blood pressure management with your GP before starting stimulant medication.");
  }

  // Check diastolic BP
  if (vitals.diastolicBP >= VITALS_THRESHOLDS.diastolicBP_MAX) {
    flags.push(`Diastolic BP elevated (${vitals.diastolicBP} mmHg ≥ 90 mmHg)`);
    recommendations.push("Discuss blood pressure management with your GP before starting stimulant medication.");
  }

  // Check heart rate
  if (vitals.heartRate >= VITALS_THRESHOLDS.heartRate_MAX) {
    flags.push(`Heart rate elevated (${vitals.heartRate} BPM ≥ 100 BPM)`);
    recommendations.push("Discuss heart rate concerns with your GP before starting stimulant medication.");
  }

  const medicationReadiness = flags.length === 0 ? "Ready" : "Requires Review";

  if (medicationReadiness === "Ready") {
    recommendations.push("Your vitals are within the standard range for starting ADHD medication assessment.");
  }

  return {
    medicationReadiness,
    flags,
    recommendations,
  };
}

/**
 * Format vitals for display
 */
export function formatVitals(vitals: VitalsReading): string {
  return `${vitals.systolicBP}/${vitals.diastolicBP} mmHg, ${vitals.heartRate} BPM`;
}

/**
 * Validate vitals input
 */
export function validateVitals(vitals: Partial<VitalsReading>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (vitals.systolicBP === undefined || vitals.systolicBP < 50 || vitals.systolicBP > 250) {
    errors.push("Systolic BP must be between 50 and 250 mmHg");
  }

  if (vitals.diastolicBP === undefined || vitals.diastolicBP < 30 || vitals.diastolicBP > 150) {
    errors.push("Diastolic BP must be between 30 and 150 mmHg");
  }

  if (vitals.heartRate === undefined || vitals.heartRate < 30 || vitals.heartRate > 200) {
    errors.push("Heart rate must be between 30 and 200 BPM");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
