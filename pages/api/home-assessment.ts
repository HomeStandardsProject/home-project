import { NextApiRequest, NextApiResponse } from "next";
import { AllRoomAssessmentQuestion } from "../../interfaces/home-assessment";
import { ApiBylawMultiplexer } from "../../interfaces/api-home-assessment";
import QuestionsData from "../../data/kingston/questions.json";
import { handleHomeAssessment } from "../../api/handleHomeAssessment/handleHomeAssessment";

const TestMultiPlexer: ApiBylawMultiplexer = {
  rules: [
    { bylawId: "id1", mustBeTrue: ["1"], mustBeFalse: [] },
    { bylawId: "id2", mustBeTrue: ["2"], mustBeFalse: [] },
  ],
  bylaws: {
    id1: { name: "1.0 Violation", description: "Test 1 description" },
    id2: { name: "2.0 Violation", description: "Test 1 description" },
  },
};

function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  const questions = QuestionsData as AllRoomAssessmentQuestion;
  return handleHomeAssessment(req, res, TestMultiPlexer, questions);
}

export default curriedHandler;
