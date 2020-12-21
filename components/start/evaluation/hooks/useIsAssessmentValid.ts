import * as React from "react";
import { Room } from "../../../../interfaces/home-assessment";
import { useRoomAssessmentQuestions } from "./useRoomAssessmentQuestions";

export const useIsAssessmentValid = (rooms: Room[]): [boolean, string[]] => {
  const allQuestions = useRoomAssessmentQuestions();

  const memoedReturn: [boolean, string[]] = React.useMemo(() => {
    const invalidRoomIds: string[] = [];

    for (const room of rooms) {
      const questionsForType = allQuestions[room.type];
      for (const question of questionsForType) {
        const response = room.responses[question.id];
        if (!response || !response.answer) {
          invalidRoomIds.push(room.id);
        }
      }
    }

    return [invalidRoomIds.length === 0, invalidRoomIds];
  }, [allQuestions, rooms]);

  return memoedReturn;
};
