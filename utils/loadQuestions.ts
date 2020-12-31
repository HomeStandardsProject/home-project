import QuestionsData from "../data/kingston/questions.json";
import {
  AllRoomAssessmentQuestion,
  RoomType,
  RoomTypes,
  ROOM_TYPES,
} from "../interfaces/home-assessment";

type QuestionInput = {
  id: number;
  question: string;
  roomType: string;
  promptForDescriptionOn: string;
  order: number | string;
  type: string;
  multiselectValues: string;
};

export const INITIAL_VALUES_QUESTIONS_VALUES: AllRoomAssessmentQuestion = ROOM_TYPES.reduce(
  (result, newValue) => {
    const newResult = result;
    newResult[newValue] = [];
    return newResult;
  },
  {} as AllRoomAssessmentQuestion
);

export const ERRORS = {
  DUPLICATE_QUESTION_ID: (id: string | number) =>
    new Error(`Failed to transform, question ID ${id} already exist.`),
  INVALID_TYPE: (id: string, property: string, type: string) =>
    new Error(
      `Failed to transform, ${property} of question ID ${id} is not of type ${type}`
    ),
};

export function loadQuestionsFromData(questions: QuestionInput[]) {
  // Empty map where each room type is a "bucket" and we'll fill them
  // up based on the input questions.
  const roomBuckets: AllRoomAssessmentQuestion = {
    ...INITIAL_VALUES_QUESTIONS_VALUES,
  };
  // array to ensure there are no duplicate ids
  const pastQuestionIds: number[] = [];

  for (const inputQuestion of questions) {
    // is the roomType a known room type?
    if (!ROOM_TYPES.includes(inputQuestion.roomType as RoomTypes)) {
      console.warn(
        `skipping question ${inputQuestion.id} since the type ${inputQuestion.roomType} is unknown`
      );
      continue;
    }

    const {
      id,
      roomType,
      question,
      promptForDescriptionOn,
      type,
      multiselectValues,
      order,
    } = inputQuestion;

    // has a question with this id already been added?
    if (pastQuestionIds.includes(id)) {
      throw ERRORS.DUPLICATE_QUESTION_ID(id);
    }

    // is type valid?
    const validTypes = ["YES/NO", "MULTISELECT"];
    if (!validTypes.includes(type)) {
      throw ERRORS.INVALID_TYPE(`${id}`, "type", validTypes.join(", "));
    }
    // is promptForDescriptionOn have a valid type?
    if (!["YES", "NO"].includes(promptForDescriptionOn)) {
      throw ERRORS.INVALID_TYPE(`${id}`, "promptForDescriptionOn", "YES or NO");
    }

    if (type === "MULTISELECT" && !multiselectValues) {
      throw ERRORS.INVALID_TYPE(`${id}`, "multiselectValues", "defined");
    }

    if (typeof order === "string" && order !== "") {
      throw ERRORS.INVALID_TYPE(`${id}`, `order`, `number or empty string`);
    }

    roomBuckets[roomType as RoomTypes].push({
      id: `${id}`,
      question,
      type: type as RoomType,
      order: typeof order === "string" ? null : (order as number),
      promptForDescriptionOn: promptForDescriptionOn as "YES" | "NO",
      multiselectValues: multiselectValues?.split(","),
    });
    pastQuestionIds.push(id);
  }

  // sort questions based on order property
  for (const roomType of ROOM_TYPES) {
    roomBuckets[roomType] = roomBuckets[roomType].sort((a, b) =>
      (a.order ?? 0) > (b.order ?? 0) ? 1 : -1
    );
  }

  return roomBuckets;
}

export function loadQuestions() {
  return loadQuestionsFromData(QuestionsData);
}
