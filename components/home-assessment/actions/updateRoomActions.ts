import {
  HomeAssessmentData,
  RoomTypes,
} from "../../../interfaces/home-assessment";

export function updateRoomName(
  assessment: HomeAssessmentData,
  selectedRoomId: string,
  newName: string | undefined
) {
  const newRooms = assessment.rooms.map((room) =>
    room.id === selectedRoomId ? { ...room, name: newName } : room
  );

  return { ...assessment, rooms: newRooms };
}

export function updateRoomType(
  assessment: HomeAssessmentData,
  selectedRoomId: string,
  newType: RoomTypes
) {
  const newRooms = assessment.rooms.map((room) =>
    room.id === selectedRoomId ? { ...room, type: newType } : room
  );

  return { ...assessment, rooms: newRooms };
}

export function updateRoomQuestionAnswer(
  assessment: HomeAssessmentData,
  selectedRoomId: string,
  questionId: string,
  answer: "YES" | "NO" | "UNSURE" | undefined,
  description: string | undefined
) {
  const newRooms = assessment.rooms.map((room) => {
    if (room.id === selectedRoomId) {
      const newResponses = { ...room.responses };
      newResponses[questionId] = { answer, description };
      return { ...room, responses: newResponses };
    }
    return room;
  });

  return { ...assessment, rooms: newRooms };
}
