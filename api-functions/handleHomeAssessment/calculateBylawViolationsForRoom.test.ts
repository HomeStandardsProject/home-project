import { calculateBylawViolationsForRoom } from "./calculateBylawViolationsForRoom";
import {
  ApiBylawMultiplexer,
  ApiRoomAssessmentQuestionResponse,
} from "../../interfaces/api-home-assessment";

const MOCK_MULTIPLEXER: ApiBylawMultiplexer = {
  rules: [
    { bylawId: "id1", mustBeTrue: ["1"], mustBeFalse: [] },
    { bylawId: "id2", mustBeTrue: [], mustBeFalse: ["2"] },
    { bylawId: "id3", mustBeTrue: ["2"], mustBeFalse: ["1"] },
  ],
  bylaws: {
    id1: { name: "1.0 Violation", description: "1.0 description" },
    id2: { name: "2.0 Violation", description: "2.0 description" },
    id3: { name: "3.0 Violation", description: "3.0 description" },
  },
};

describe("calculateBylawViolationsForRoom", () => {
  it("returns empty array when no matches", () => {
    const responses: {
      [questionId: string]: ApiRoomAssessmentQuestionResponse;
    } = {};

    const violations = calculateBylawViolationsForRoom(
      responses,
      MOCK_MULTIPLEXER
    );
    expect(violations).toEqual({ violations: [], possibleViolations: [] });
  });

  it("correctly handles truthy bylaws", () => {
    const responses: {
      [questionId: string]: ApiRoomAssessmentQuestionResponse;
    } = {
      "1": { answer: "YES" },
      "2": { answer: "YES" },
    };

    const violations = calculateBylawViolationsForRoom(
      responses,
      MOCK_MULTIPLEXER
    );

    expect(violations).toEqual({
      violations: [
        {
          id: "id1",
          name: "1.0 Violation",
          description: "1.0 description",
          userProvidedDescriptions: [],
        },
      ],
      possibleViolations: [],
    });
  });

  it("correctly handles falsy bylaws", () => {
    const responses: {
      [questionId: string]: ApiRoomAssessmentQuestionResponse;
    } = {
      "1": { answer: "NO" },
      "2": { answer: "NO" },
    };

    const violations = calculateBylawViolationsForRoom(
      responses,
      MOCK_MULTIPLEXER
    );

    expect(violations).toEqual({
      violations: [
        {
          id: "id2",
          name: "2.0 Violation",
          description: "2.0 description",
          userProvidedDescriptions: [],
        },
      ],
      possibleViolations: [],
    });
  });

  it("correctly handles truthy and falsy bylaw rule", () => {
    const responses: {
      [questionId: string]: ApiRoomAssessmentQuestionResponse;
    } = {
      "1": { answer: "NO", description: "question 1 description" },
      "2": { answer: "YES", description: "question 2 description" },
    };

    const violations = calculateBylawViolationsForRoom(
      responses,
      MOCK_MULTIPLEXER
    );

    expect(violations).toEqual({
      violations: [
        {
          id: "id3",
          name: "3.0 Violation",
          description: "3.0 description",
          userProvidedDescriptions: [
            "question 1 description",
            "question 2 description",
          ],
        },
      ],
      possibleViolations: [],
    });
  });

  it("correctly handles truthy bylaw with unsure prompt", () => {
    const responses: {
      [questionId: string]: ApiRoomAssessmentQuestionResponse;
    } = {
      "1": { answer: "UNSURE", description: "question 1 description" },
      "2": { answer: "YES", description: "question 2 description" },
    };

    const violations = calculateBylawViolationsForRoom(
      responses,
      MOCK_MULTIPLEXER
    );

    expect(violations).toEqual({
      violations: [],
      possibleViolations: [
        {
          id: "id1",
          name: "1.0 Violation",
          description: "1.0 description",
          userProvidedDescriptions: ["question 1 description"],
        },
        {
          id: "id3",
          name: "3.0 Violation",
          description: "3.0 description",
          userProvidedDescriptions: [
            "question 1 description",
            "question 2 description",
          ],
        },
      ],
    });
  });

  it("correctly handles falsy bylaw with unsure prompt", () => {
    const responses: {
      [questionId: string]: ApiRoomAssessmentQuestionResponse;
    } = {
      "1": { answer: "NO", description: "question 1 description" },
      "2": { answer: "UNSURE", description: "question 2 description" },
    };

    const violations = calculateBylawViolationsForRoom(
      responses,
      MOCK_MULTIPLEXER
    );

    expect(violations).toEqual({
      violations: [],
      possibleViolations: [
        {
          id: "id2",
          name: "2.0 Violation",
          description: "2.0 description",
          userProvidedDescriptions: ["question 2 description"],
        },
        {
          id: "id3",
          name: "3.0 Violation",
          description: "3.0 description",
          userProvidedDescriptions: [
            "question 1 description",
            "question 2 description",
          ],
        },
      ],
    });
  });
});
