import { describe, expect, it } from "vitest";
import { assessMedicationReadiness, validateVitals, formatVitals, type VitalsReading } from "@shared/vitals";

describe("Vitals Assessment Logic", () => {
  describe("assessMedicationReadiness", () => {
    it("should return Ready when vitals are within normal range", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 70,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Ready");
    });

    it("should return Requires Review when systolic BP exceeds 140", () => {
      const vitals: VitalsReading = {
        systolicBP: 145,
        diastolicBP: 80,
        heartRate: 70,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Requires Review");
      expect(result.flags.some((f) => f.includes("Systolic"))).toBe(true);
    });

    it("should return Requires Review when diastolic BP exceeds 90", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 95,
        heartRate: 70,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Requires Review");
      expect(result.flags.some((f) => f.includes("Diastolic"))).toBe(true);
    });

    it("should return Requires Review when heart rate exceeds 100", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 105,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Requires Review");
      expect(result.flags.some((f) => f.includes("Heart rate"))).toBe(true);
    });

    it("should flag multiple issues when present", () => {
      const vitals: VitalsReading = {
        systolicBP: 150,
        diastolicBP: 95,
        heartRate: 110,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Requires Review");
      expect(result.flags.length).toBeGreaterThan(1);
    });

    it("should include recommendations in result", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 70,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("validateVitals", () => {
    it("should accept valid vitals", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 70,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should reject systolic BP below 50", () => {
      const vitals: VitalsReading = {
        systolicBP: 40,
        diastolicBP: 80,
        heartRate: 70,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Systolic"))).toBe(true);
    });

    it("should reject systolic BP above 250", () => {
      const vitals: VitalsReading = {
        systolicBP: 260,
        diastolicBP: 80,
        heartRate: 70,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Systolic"))).toBe(true);
    });

    it("should reject diastolic BP below 30", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 20,
        heartRate: 70,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Diastolic"))).toBe(true);
    });

    it("should reject diastolic BP above 150", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 160,
        heartRate: 70,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Diastolic"))).toBe(true);
    });

    it("should reject heart rate below 30", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 20,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Heart rate"))).toBe(true);
    });

    it("should reject heart rate above 200", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 210,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("Heart rate"))).toBe(true);
    });

    it("should reject multiple invalid values", () => {
      const vitals: VitalsReading = {
        systolicBP: 40,
        diastolicBP: 160,
        heartRate: 20,
      };
      const result = validateVitals(vitals);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("formatVitals", () => {
    it("should format vitals as string", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 70,
      };
      const formatted = formatVitals(vitals);
      expect(typeof formatted).toBe("string");
      expect(formatted).toContain("120");
      expect(formatted).toContain("80");
      expect(formatted).toContain("70");
    });

    it("should include BP and HR in formatted string", () => {
      const vitals: VitalsReading = {
        systolicBP: 130,
        diastolicBP: 85,
        heartRate: 75,
      };
      const formatted = formatVitals(vitals);
      expect(formatted).toContain("130/85");
      expect(formatted).toContain("75");
    });
  });

  describe("NICE Guideline Thresholds", () => {
    it("should flag BP at exactly 140/90 as requiring review", () => {
      const vitals: VitalsReading = {
        systolicBP: 140,
        diastolicBP: 90,
        heartRate: 70,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Requires Review");
    });

    it("should flag HR at exactly 100 as requiring review", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 100,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Requires Review");
    });

    it("should accept BP just below 140/90", () => {
      const vitals: VitalsReading = {
        systolicBP: 139,
        diastolicBP: 89,
        heartRate: 70,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Ready");
    });

    it("should accept HR just below 100", () => {
      const vitals: VitalsReading = {
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 99,
      };
      const result = assessMedicationReadiness(vitals);
      expect(result.medicationReadiness).toBe("Ready");
    });
  });
});
