import * as React from "react";
import {
  RoomAssessmentQuestion,
  RoomTypes,
  ROOM_TYPES,
} from "../../../../interfaces/home-assessment";

export type RoomAssessmentQuestions = {
  [type in RoomTypes]: RoomAssessmentQuestion[];
};

// initialize a map of empty questions as the initial value
export const INITIAL_VALUES: RoomAssessmentQuestions = ROOM_TYPES.reduce(
  (result, newValue) => {
    const newResult = result;
    newResult[newValue] = [];
    return newResult;
  },
  {} as RoomAssessmentQuestions
);

export const RoomAssessmentQuestionsContext = React.createContext<
  RoomAssessmentQuestions
>(INITIAL_VALUES);

export const useRoomAssessmentQuestions = () => {
  const questions = React.useContext(RoomAssessmentQuestionsContext);
  return questions;
};
