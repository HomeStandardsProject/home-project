import { NextApiRequest, NextApiResponse } from "next";
import { check, validationResult } from "express-validator";
import {
  ROOM_TYPES,
  RENTAL_TYPES,
  LANDLORDS,
  AllRoomAssessmentQuestion,
  RoomTypes,
} from "../../interfaces/home-assessment";
import { validateMiddleware } from "../utils/validation";
import {
  ApiBylawMultiplexer,
  ApiHomeAssessmentInput,
  ApiRoomAssessmentQuestionResponse,
} from "../../interfaces/api-home-assessment";

const validateSchema = validateMiddleware(
  [
    check("details.address").isString(),
    // .map is a workaround to a typescript readonly issue
    check("details.rentalType").isIn(RENTAL_TYPES.map((i) => i)),
    check("details.totalRent").isString(),
    check("details.landlord").isIn(LANDLORDS.map((i) => i)),
    check("details.landlordOther").optional({ nullable: true }).isString(),

    check("rooms.*.type").isIn(ROOM_TYPES.map((i) => i)),
    check("rooms.*.responses").exists(),
    check("rooms.*.responses.*.answer").isIn(["YES", "NO"]),
    check("rooms.*.responses.*.description")
      .optional({ nullable: true })
      .isString(),
  ],
  validationResult
);

function validateAllPromptsAreAnswered(
  type: RoomTypes,
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse },
  questions: AllRoomAssessmentQuestion
) {
  const validationErrors = [];
  const questionsForType = questions[type];
  for (const question of questionsForType) {
    if (!responses[question.id]) {
      validationErrors.push({
        msg: `question with id ${question.id} is left unanswered for type ${type}`,
      });
    }
  }

  return validationErrors.length === 0 ? null : validationErrors;
}

export async function handleHomeAssessment(
  req: NextApiRequest,
  res: NextApiResponse,
  _: ApiBylawMultiplexer,
  questions: AllRoomAssessmentQuestion
) {
  try {
    const validationErrors = await validateSchema(req);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors.array() });

    const inputs = req.body as ApiHomeAssessmentInput;

    const promptValidationErrors = inputs.rooms
      .map((room) =>
        validateAllPromptsAreAnswered(room.type, room.responses, questions)
      )
      .flat()
      .filter((vals) => vals);

    if (promptValidationErrors.length > 0) {
      return res.status(400).json({ errors: promptValidationErrors });
    }

    return res.status(200).json({ hello: true });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
}
