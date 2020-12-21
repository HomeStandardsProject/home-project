import { INITIAL_VALUES as INITIAL_ROOMS_VALUES } from "../components/start/evaluation/hooks/useRoomAssessmentQuestions";
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
  // Empty map where each room type is a "bucket" and we'll fill them
  // up based on the input questions.
  const roomBuckets: AllRoomAssessmentQuestion = { ...INITIAL_ROOMS_VALUES };
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

    const { id, roomType, question, promptForDescriptionOn } = inputQuestion;

    // has a question with this id already been added?
    if (pastQuestionIds.includes(id)) {
      throw ERRORS.DUPLICATE_QUESTION_ID(id);
    }

    // is promptForDescriptionOn have a valid type?
    if (!["YES", "NO"].includes(promptForDescriptionOn)) {
      throw ERRORS.INVALID_TYPE(`${id}`, "promptForDescriptionOn", "YES or NO");
    }

    roomBuckets[roomType as RoomTypes].push({
      id: `${id}`,
      question,
      promptForDescriptionOn: promptForDescriptionOn as "YES" | "NO",
    });
    pastQuestionIds.push(id);
  }

  return roomBuckets;
}

export function loadQuestions() {
  return loadQuestionsFromData(QuestionsData);
}
