import {
  AllRoomAssessmentQuestion,
  HomeEvaluationData,
  isGeneralRoomType,
} from "../../../../interfaces/home-assessment";

export function useHomeEvaluationProgress(
  data: HomeEvaluationData,
  questions: AllRoomAssessmentQuestion
) {
  const nonGeneralRooms = data.rooms.filter(
    (room) => !isGeneralRoomType(room.type)
  );

  let totalQuestions = 0;
  let totalQuestionsAnswered = 0;

  for (const room of nonGeneralRooms) {
    const questionsForType = questions[room.type];
    for (const question of questionsForType) {
      const response = room.responses[question.id];
      totalQuestions += 1;
      if (response && response.answer) {
        totalQuestionsAnswered += 1;
      }
    }
  }

  const generalRooms = data.rooms.filter((room) =>
    isGeneralRoomType(room.type)
  );
  for (const room of generalRooms) {
    const questionsForType = questions[room.type];
    for (const question of questionsForType) {
      const response = room.responses[question.id];

      if (response && response.answer) {
        totalQuestions += 1;
        totalQuestionsAnswered += 1;
      }
    }
  }

  return Math.round((totalQuestionsAnswered / totalQuestions) * 100);
}
