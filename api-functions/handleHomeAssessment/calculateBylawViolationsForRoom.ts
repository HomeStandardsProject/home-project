import {
  ApiBylawMultiplexer,
  ApiBylawViolation,
  ApiRoomAssessmentQuestionResponse,
} from "../../interfaces/api-home-assessment";

export function calculateBylawViolationsForRoom(
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse },
  bylawMultiplexer: ApiBylawMultiplexer
): {
  violations: ApiBylawViolation[];
  possibleViolations: ApiBylawViolation[];
} {
  const violations: ApiBylawViolation[] = [];
  const possibleViolations: ApiBylawViolation[] = [];

  for (const rule of bylawMultiplexer.rules) {
    const meetsYesCriteria = responsesMeetBooleanGuidelines(
      "YES",
      rule.mustBeTrue,
      responses
    );
    const meetsNoCriteria = responsesMeetBooleanGuidelines(
      "NO",
      rule.mustBeFalse,
      responses
    );

    if (meetsYesCriteria === "NO" || meetsNoCriteria === "NO") {
      // Rule criteria is not met
      continue;
    }

    const bylaw = bylawMultiplexer.bylaws[rule.bylawId];
    const questionIds = [...rule.mustBeFalse, ...rule.mustBeTrue];
    const userProvidedDescriptions = questionIds
      .map((id) => responses[id] && responses[id].description)
      .filter((val) => val);

    if ([meetsNoCriteria, meetsYesCriteria].includes("POSSIBLE-YES")) {
      // the criteria includes an prompt that was answered with unsure
      possibleViolations.push({
        ...bylaw,
        id: rule.bylawId,
        userProvidedDescriptions: userProvidedDescriptions as string[],
      });
    } else {
      violations.push({
        ...bylaw,
        id: rule.bylawId,
        userProvidedDescriptions: userProvidedDescriptions as string[],
      });
    }
  }

  return { violations, possibleViolations };
}

const responsesMeetBooleanGuidelines = (
  desiredAnswer: "YES" | "NO",
  questionsIdsForRule: string[],
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse }
): "NO" | "POSSIBLE-YES" | "YES" => {
  let containsUnsureAnswer = false;
  for (const questionId of questionsIdsForRule) {
    if (responses[questionId]) {
      const questionAnswer = responses[questionId].answer;
      if (questionAnswer !== desiredAnswer) {
        // but wait, is the answer unsure?
        if (questionAnswer === "UNSURE") {
          containsUnsureAnswer = true;
        } else {
          return "NO";
        }
      }
    } else {
      return "NO";
    }
  }
  if (containsUnsureAnswer) {
    return "POSSIBLE-YES";
  }
  return "YES";
};
