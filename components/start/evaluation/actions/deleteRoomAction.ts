import { HomeAssessmentData } from "../../../../interfaces/home-assessment";

export function deleteRoomAction(
  assessment: HomeAssessmentData,
  idToDelete: string
) {
  if (assessment.rooms.length <= 1) {
    console.error("invalid state. unable to delete only remaining room");
    return assessment;
  }

  const newRooms = assessment.rooms.filter((room) => room.id !== idToDelete);

  const newSelectedRoomId =
    assessment.selectedRoomId === idToDelete
      ? newRooms[0].id
      : assessment.selectedRoomId;

  return {
    ...assessment,
    selectedRoomId: newSelectedRoomId,
    rooms: newRooms,
  };
}
