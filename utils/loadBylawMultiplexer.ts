import { ApiBylawMultiplexer } from "../interfaces/api-home-assessment";
import {
  AllRoomAssessmentQuestion,
  RoomTypes,
} from "../interfaces/home-assessment";

type InputBylaws = {
  id: number;
  name: string;
  description: string;
  mustBeYes: number | number[] | string;
  mustBeNo: number | number[] | string;
};

export const ERRORS = {
  DUPLICATE_BYLAW: (id: string | number) =>
    new Error(`Failed to transform, bylaw ID ${id} already exist.`),
  INVALID_QUESTION_ID: (id: string | number) =>
    new Error(
      `Failed to transform, bylaw ID ${id} includes a question id that does not exist`
    ),
  INVALID_RULE: (id: string | number) =>
    new Error(
      `Failed to transform, bylaw ID ${id} includes a question id that appears in both the mustBeYes and mustBeNo arrays.`
    ),
};

export function loadBylawMultiplexerFromData(
  inputBylaws: InputBylaws[],
  questions: AllRoomAssessmentQuestion
) {
  const multiplexer: ApiBylawMultiplexer = { rules: [], bylaws: {} };

  for (const inputBylaw of inputBylaws) {
    if (multiplexer.bylaws[inputBylaw.id]) {
      throw ERRORS.DUPLICATE_BYLAW(inputBylaw.id);
    }

    const mustBeTrue = transformToStringArray(inputBylaw.mustBeYes);
    const mustBeFalse = transformToStringArray(inputBylaw.mustBeNo);

    // mildly expensive check; should be okay since this should happen at build time
    const isMustBeTrueValid = !mustBeTrue
      .map((id) => validateThatEachItemIsValidQuestionId(id, questions))
      .includes(false);
    const isMustBeFalseValid = !mustBeFalse
      .map((id) => validateThatEachItemIsValidQuestionId(id, questions))
      .includes(false);

    if (!areArraysUnique(mustBeFalse, mustBeTrue)) {
      throw ERRORS.INVALID_RULE(inputBylaw.id);
    }

    if (!isMustBeTrueValid || !isMustBeFalseValid) {
      throw ERRORS.INVALID_QUESTION_ID(inputBylaw.id);
    }

    multiplexer.rules.push({
      bylawId: `${inputBylaw.id}`,
      mustBeTrue,
      mustBeFalse,
    });
    multiplexer.bylaws[inputBylaw.id] = {
      name: inputBylaw.name,
      description: inputBylaw.description,
    };
  }
  return multiplexer;
}

function transformToStringArray(
  possibleArray: number | number[] | string
): string[] {
  if (Array.isArray(possibleArray))
    return possibleArray.map((item) => `${item}`);
  if (possibleArray === "") return [];
  return [`${possibleArray}`];
}

function validateThatEachItemIsValidQuestionId(
  id: string,
  questions: AllRoomAssessmentQuestion
) {
  const found = Object.keys(questions).find((roomType) =>
    questions[roomType as RoomTypes].find((question) => question.id === id)
  );
  return !!found;
}

function areArraysUnique<T>(a: T[], b: T[]) {
  for (const itemA of a) {
    if (b.includes(itemA)) return false;
  }
  return true;
}
