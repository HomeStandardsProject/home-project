import { AllRoomAssessmentQuestion } from "../../../../interfaces/home-assessment";
import { NormalizedRoom } from "../helpers/normalizeRooms";

export function useInvalidRoomIds(
  rooms: NormalizedRoom[],
  questions: AllRoomAssessmentQuestion
) {
  const invalidRoomIds: string[] = [];

  for (const room of rooms) {
    const questionsForType = questions[room.type];

    for (const question of questionsForType) {
      const response = room.responses[question.id];

      if (!response || !response.answer) {
        invalidRoomIds.push(room.id);
        break;
      }
    }
  }

  return invalidRoomIds;
}
