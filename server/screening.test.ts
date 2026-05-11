import { describe, expect, it } from "vitest";
import { calculateASRSScore, isScreeningComplete, ASRS_QUESTIONS } from "@shared/screening";

describe("ASRS v1.1 Screening Logic", () => {
  describe("calculateASRSScore", () => {
    it("should return Low likelihood when score is 0-1", () => {
      const responses = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
      };
      const result = calculateASRSScore(responses);
      expect(result.likelihood).toBe("Low");
      expect(result.partAScore).toBe(0);
    });

    it("should return Moderate likelihood when score is 2-3", () => {
      const responses = {
        1: 3,
        2: 3,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
      };
      const result = calculateASRSScore(responses);
      expect(result.likelihood).toBe("Moderate");
      expect(result.partAScore).toBeGreaterThanOrEqual(2);
      expect(result.partAScore).toBeLessThan(4);
    });

    it("should return High likelihood when score is 4 or more", () => {
      const responses = {
        1: 3,
        2: 3,
        3: 3,
        4: 4,
        5: 4,
        6: 1,
      };
      const result = calculateASRSScore(responses);
      expect(result.likelihood).toBe("High");
      expect(result.partAScore).toBeGreaterThanOrEqual(4);
    });

    it("should correctly score mixed responses", () => {
      const responses = {
        1: 5,
        2: 4,
        3: 3,
        4: 2,
        5: 1,
        6: 1,
      };
      const result = calculateASRSScore(responses);
      expect(result.partAScore).toBe(3);
      expect(result.likelihood).toBe("Moderate");
    });

    it("should include message in result", () => {
      const responses = {
        1: 3,
        2: 3,
        3: 3,
        4: 4,
        5: 4,
        6: 4,
      };
      const result = calculateASRSScore(responses);
      expect(result.message).toBeDefined();
      expect(result.message.length).toBeGreaterThan(0);
    });
  });

  describe("isScreeningComplete", () => {
    it("should return false when no responses provided", () => {
      const responses = {};
      expect(isScreeningComplete(responses)).toBe(false);
    });

    it("should return false when only some questions answered", () => {
      const responses = {
        1: 4,
        2: 4,
        3: 4,
      };
      expect(isScreeningComplete(responses)).toBe(false);
    });

    it("should return true when all 6 questions answered", () => {
      const responses = {
        1: 4,
        2: 4,
        3: 4,
        4: 4,
        5: 4,
        6: 4,
      };
      expect(isScreeningComplete(responses)).toBe(true);
    });

    it("should return false when responses have invalid question IDs", () => {
      const responses = {
        1: 4,
        2: 4,
        3: 4,
        4: 4,
        5: 4,
        7: 4,
      };
      expect(isScreeningComplete(responses)).toBe(false);
    });
  });

  describe("ASRS Questions", () => {
    it("should have exactly 6 questions", () => {
      expect(ASRS_QUESTIONS.length).toBe(6);
    });

    it("should have questions with proper structure", () => {
      ASRS_QUESTIONS.forEach((question) => {
        expect(question.id).toBeDefined();
        expect(question.text).toBeDefined();
        expect(typeof question.text).toBe("string");
        expect(question.text.length).toBeGreaterThan(0);
      });
    });

    it("should have questions numbered 1-6", () => {
      const ids = ASRS_QUESTIONS.map((q) => q.id);
      expect(ids).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("NICE Guideline Compliance", () => {
    it("should mark 4+ positive indicators as High likelihood", () => {
      const responses = {
        1: 3,
        2: 3,
        3: 3,
        4: 4,
        5: 4,
        6: 1,
      };
      const result = calculateASRSScore(responses);
      expect(result.likelihood).toBe("High");
    });

    it("should mark 3 or fewer positive indicators as not High", () => {
      const responses = {
        1: 3,
        2: 3,
        3: 3,
        4: 1,
        5: 1,
        6: 1,
      };
      const result = calculateASRSScore(responses);
      expect(result.likelihood).not.toBe("High");
    });
  });
});
