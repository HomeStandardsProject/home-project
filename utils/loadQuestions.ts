import QuestionsData from "../data/kingston/questions.json";
import {
  AllRoomAssessmentQuestion,
  RoomTypes,
  ROOM_TYPES,
} from "../interfaces/home-assessment";

type QuestionInput = {
  id: number;
  question: string;
  roomType: string;
  promptForDescriptionOn: string;
};

export const ERRORS = {
  DUPLICATE_QUESTION_ID: (id: string | number) =>
    new Error(`Failed to transform, question ID ${id} already exist.`),
  INVALID_TYPE: (id: string, property: string, type: string) =>
    new Error(
      `Failed to transform, ${property} of question ID ${id} is not of type ${type}`
    ),
};

export function loadQuestionsFromData(questions: QuestionInput[]) {
  // initialize a map of empty map where each room type is a "bucket"
  // and we'll fill them up based on the input questions.
  const roomBuckets: AllRoomAssessmentQuestion = ROOM_TYPES.reduce(
    (result, newValue) => {
      const newResult = result;
      newResult[newValue] = [];
      return newResult;
    },
    {} as AllRoomAssessmentQuestion
  );
  // array to ensure there are no duplicate ids
  const pastQuestionIds: number[] = [];

  for (const inputQuestion of questions) {
    // is the roomType a known room type?
    if (ROOM_TYPES.includes(inputQuestion.roomType as RoomTypes)) {
      const { id, roomType, question, promptForDescriptionOn } = inputQuestion;

      // has a question with this id already been added?
      if (!pastQuestionIds.includes(id)) {
        // is promptForDescriptionOn have a valid type?
        if (["YES", "NO"].includes(promptForDescriptionOn)) {
          roomBuckets[roomType as RoomTypes].push({
            id: `${id}`,
            question,
            promptForDescriptionOn: promptForDescriptionOn as "YES" | "NO",
          });
          pastQuestionIds.push(id);
        } else {
          throw ERRORS.INVALID_TYPE(
            `${id}`,
            "promptForDescriptionOn",
            "YES or NO"
          );
        }
      } else {
        throw ERRORS.DUPLICATE_QUESTION_ID(id);
      }
    } else {
      console.warn(
        `skipping question ${inputQuestion.id} since the type ${inputQuestion.roomType} is unknown`
      );
    }
  }

  return roomBuckets;
}

export function loadQuestions() {
  return loadQuestionsFromData(QuestionsData);
}
