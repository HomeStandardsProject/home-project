import {
  HomeAssessmentData,
  RoomAssessmentQuestion,
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
  newType: RoomTypes,
  questions: RoomAssessmentQuestion[]
) {
  const newRooms = assessment.rooms.map((room) =>
    room.id === selectedRoomId ? { ...room, type: newType, questions } : room
  );

  return { ...assessment, rooms: newRooms };
}

export function updateRoomQuestionAnswer(
  assessment: HomeAssessmentData,
  selectedRoomId: string,
  questionId: string,
  answer: "YES" | "NO" | undefined,
  description: string | undefined
) {
  const newRooms = assessment.rooms.map((room) => {
    if (room.id === selectedRoomId) {
      const newQuestions = room.questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answer,
            description,
          };
        }
        return question;
      });
      return { ...room, questions: newQuestions };
    }
    return room;
  });

  return { ...assessment, rooms: newRooms };
}
