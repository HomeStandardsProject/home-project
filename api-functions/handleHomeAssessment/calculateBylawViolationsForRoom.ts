import {
  ApiBylawMultiplexer,
  ApiBylawViolation,
  ApiRoomAssessmentQuestionResponse,
} from "../../interfaces/api-home-assessment";

export function calculateBylawViolationsForRoom(
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse },
  bylawMultiplexer: ApiBylawMultiplexer
): ApiBylawViolation[] {
  const violations: ApiBylawViolation[] = [];

  for (const rule of bylawMultiplexer.rules) {
    if (!responsesMeetBooleanGuidelines("YES", rule.mustBeTrue, responses)) {
      continue;
    }

    if (!responsesMeetBooleanGuidelines("NO", rule.mustBeFalse, responses)) {
      continue;
    }

    const bylaw = bylawMultiplexer.bylaws[rule.bylawId];
    const questionIds = [...rule.mustBeFalse, ...rule.mustBeTrue];
    const userProvidedDescriptions = questionIds
      .map((id) => responses[id] && responses[id].description)
      .filter((val) => val);

    violations.push({
      ...bylaw,
      id: rule.bylawId,
      userProvidedDescriptions: userProvidedDescriptions as string[],
    });
  }
  return violations;
}

const responsesMeetBooleanGuidelines = (
  answer: "YES" | "NO",
  questionsIds: string[],
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse }
) => {
  for (const questionId of questionsIds) {
    if (responses[questionId]) {
      if (responses[questionId].answer !== answer) return false;
    } else {
      return false;
    }
  }
  return true;
};
