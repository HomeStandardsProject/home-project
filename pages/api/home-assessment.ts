import { NextApiRequest, NextApiResponse } from "next";
import { AllRoomAssessmentQuestion } from "../../interfaces/home-assessment";

import QuestionsData from "../../data/kingston/questions.json";
import KingstonBylawMultiplexer from "../../data/kingston/bylawMultiplexer.json";
import { handleHomeAssessment } from "../../api/handleHomeAssessment/handleHomeAssessment";
import { ApiBylawMultiplexer } from "../../interfaces/api-home-assessment";

function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  const questions = QuestionsData as AllRoomAssessmentQuestion;
  const multiplexer = KingstonBylawMultiplexer as ApiBylawMultiplexer;
  return handleHomeAssessment(req, res, multiplexer, questions);
}

export default curriedHandler;
