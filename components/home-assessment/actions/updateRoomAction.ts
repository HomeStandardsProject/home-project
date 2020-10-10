import { HomeAssessmentData, Room } from "../../../interfaces/home-assessment";

export function updateRoomAction(
  assessment: HomeAssessmentData,
  newRoom: Room
) {
  const newRooms = assessment.rooms.map((room) =>
    room.id === newRoom.id ? newRoom : room
  );

  return {
    ...assessment,
    rooms: newRooms,
  };
}
