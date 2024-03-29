import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { check, validationResult } from "express-validator";
import {
  ROOM_TYPES,
  AllRoomAssessmentQuestion,
  RoomTypes,
  isGeneralRoomType,
} from "../../interfaces/home-assessment";
import { validateMiddleware } from "../utils/validation";
import {
  ApiBylawMultiplexer,
  ApiHomeAssessmentInput,
  ApiHomeAssessmentInputWithRoomIds,
  ApiHomeAssessmentResult,
  ApiRoomAssessmentQuestionResponse,
  ApiRoomAssessmentResult,
} from "../../interfaces/api-home-assessment";
import { calculateBylawViolationsForRoom } from "./calculateBylawViolationsForRoom";
import { Datastore } from "../datastore/Datastore";

const validateSchema = validateMiddleware(
  [
    check("submissionId").isString(),
    check("rooms.*.name").isString(),
    check("rooms.*.type").isIn(ROOM_TYPES.map((i) => i)),
    check("rooms.*.responses").exists(),
    check("rooms.*.responses.*.answer").isIn(["YES", "NO", "UNSURE", "NA"]),
    check("rooms.*.responses.*.description")
      .optional({ nullable: true })
      .isString(),
    check("rooms.*.responses.*.selectedMultiselect")
      .optional({ nullable: true })
      .isString(),
  ],
  validationResult
);

export type ParsedCityRules = {
  name: string;
  questions: AllRoomAssessmentQuestion;
  bylawMultiplexer: ApiBylawMultiplexer;
};

export async function handleHomeAssessment(
  req: NextApiRequest,
  res: NextApiResponse,
  cities: ParsedCityRules[],
  datastore: Datastore
) {
  try {
    const validationErrors = await validateSchema(req);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors.array() });

    const input = req.body as ApiHomeAssessmentInput;

    const [details, error] = await datastore.fetchHomeDetailsById(
      input.submissionId
    );
    if (!details || error)
      return res
        .status(400)
        .send({ errors: [{ msg: "invalid submission id" }] });

    const selectedCities = cities.filter((city) => city.name === details.city);
    if (selectedCities.length === 0) {
      return res.status(400).send({ errors: [{ msg: "invalid city" }] });
    }
    const selectedCity = selectedCities[0];

    const promptValidationErrors = input.rooms
      .map((room) =>
        validateAllPromptsAreAnswered(
          room.type,
          room.responses,
          selectedCity.questions
        )
      )
      .flat()
      .filter((vals) => vals);

    if (promptValidationErrors.length > 0) {
      return res.status(400).json({ errors: promptValidationErrors });
    }

    const inputRoomsWithId: ApiHomeAssessmentInputWithRoomIds["rooms"] = input.rooms.map(
      (room) => ({ ...room, id: uuidv4() })
    );

    const rooms = inputRoomsWithId.map(
      (room): ApiRoomAssessmentResult => {
        const result = calculateBylawViolationsForRoom(
          room.responses,
          selectedCity.bylawMultiplexer
        );
        return { id: room.id, name: room.name, ...result };
      }
    );

    const [
      inputSaveResult,
      inputSaveError,
    ] = await datastore.saveHomeAssessmentInput({
      submissionId: input.submissionId,
      rooms: inputRoomsWithId,
    });

    if (inputSaveResult === false) {
      console.error(inputSaveError);
      return res
        .status(500)
        .json({ errors: [{ msg: "Unable to save input fields" }] });
    }

    const result: ApiHomeAssessmentResult = {
      rooms,
      details,
      generatedDate: new Date(),
    };

    const [
      violationsSaveResult,
      violationsSaveError,
    ] = await datastore.saveHomeAssessmentResult(input.submissionId, result);

    if (violationsSaveResult === false) {
      console.error(violationsSaveError);
      return res
        .status(500)
        .json({ errors: [{ msg: "Unable to save violations" }] });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: (err as Error).message });
  }
}

function validateAllPromptsAreAnswered(
  type: RoomTypes,
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse },
  questions: AllRoomAssessmentQuestion
) {
  // general room type questions are optional
  if (isGeneralRoomType(type)) return null;

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
