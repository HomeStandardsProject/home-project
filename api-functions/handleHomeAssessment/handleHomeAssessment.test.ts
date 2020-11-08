import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { createMocks } from "node-mocks-http";
import {
  ApiBylawMultiplexer,
  ApiHomeAssessmentInput,
  ApiHomeAssessmentResult,
  ApiRoom,
} from "../../interfaces/api-home-assessment";
import { AllRoomAssessmentQuestion } from "../../interfaces/home-assessment";
import { MockDatastore } from "../datastore/MockDatastore";
import { generateSetOfNullifiedFields } from "../utils/generateSetOfNullifiedFields";
import { RecursiveRequiredObject } from "../utils/RecursiveRequiredObject";
import { handleHomeAssessment } from "./handleHomeAssessment";
import { Datastore } from "../datastore/Datastore";

jest.mock("uuid");

const MOCK_QUESTIONS: AllRoomAssessmentQuestion = {
  LIVING: [
    {
      id: "1",
      question: "Living room Question 1",
      promptForDescriptionOn: "NO",
    },
  ],
  WASH: [
    {
      id: "2",
      question: "Washroom Question 2",
      promptForDescriptionOn: "NO",
    },
  ],
  BED: [
    {
      id: "3",
      question: "Bedroom Question 3",
      promptForDescriptionOn: "NO",
    },
    {
      id: "4",
      question: "Bedroom Question 3",
      promptForDescriptionOn: "NO",
    },
  ],
};

const MOCK_BYLAW_MULTIPLEXER: ApiBylawMultiplexer = {
  rules: [
    { bylawId: "id1", mustBeTrue: ["1"], mustBeFalse: [] },
    { bylawId: "id2", mustBeTrue: ["4"], mustBeFalse: [] },
  ],
  bylaws: {
    id1: { name: "1.0 Violation", description: "Test 1 description" },
    id2: { name: "2.0 Violation", description: "Test 1 description" },
  },
};

const MOCK_ROOM: ApiRoom = {
  type: "BED",
  name: "Bedroom 1",
  responses: {},
};

const MOCK_DETAILS: ApiHomeAssessmentInput["details"] = {
  landlord: "Frontenac Property Management",
  rentalType: "Full-house",
  totalRent: "499.99",
  address: "99 University Ave, Kingston, ON",
};

const ONLY_REQUIRED_MOCK_INPUTS: RecursiveRequiredObject<ApiHomeAssessmentInput> = {
  details: MOCK_DETAILS,
  rooms: [
    {
      name: "Living Room 1",
      type: "LIVING",
      responses: {
        questionId1: {
          answer: "YES",
        },
      },
    },
  ],
};

const testHandleHomeAssessment = (
  req: NextApiRequest,
  res: NextApiResponse,
  datastore: Datastore = new MockDatastore()
) =>
  handleHomeAssessment(
    req,
    res,
    MOCK_BYLAW_MULTIPLEXER,
    MOCK_QUESTIONS,
    datastore
  );

describe("/api/home-assessment", () => {
  beforeAll(() => {
    // @ts-expect-error type error due to mocking
    uuidv4.mockImplementation(() => "randomId");
  });
  // ensures that all properties defined in ONLY_REQUIRED_MOCK_INPUTS have a corresponding
  // express-validator at the api level. This helps with forgetting to add a validator when
  // adding a new property to an object
  it("implements basic existence validation for all parameters", async () => {
    const nullifiedFields = generateSetOfNullifiedFields(
      ONLY_REQUIRED_MOCK_INPUTS
    );

    const validationError = (param: string) => ({
      errors: [{ location: "body", msg: "Invalid value", param }],
    });

    for (const nullCase of nullifiedFields) {
      const { req, res } = createMocks({
        method: "POST",
        body: nullCase.case,
      });

      await testHandleHomeAssessment(req, res);

      const statusCode = res._getStatusCode();
      const response = JSON.parse(res._getData());
      if (statusCode !== 400 && response !== validationError(nullCase.name)) {
        fail(`Unimplemented existence validator for property ${nullCase.name}`);
      }
    }
  });

  it("returns 400 when all questions are unanswered", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
        rooms: [
          {
            ...MOCK_ROOM,
            responses: {},
          },
        ],
      },
    });

    await testHandleHomeAssessment(req, res);

    expect(res._getStatusCode()).toEqual(400);
    expect(JSON.parse(res._getData())).toEqual({
      errors: [
        { msg: "question with id 3 is left unanswered for type BED" },
        { msg: "question with id 4 is left unanswered for type BED" },
      ],
    });
  });

  it("returns 400 when not all questions are answered", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
        rooms: [
          {
            ...MOCK_ROOM,
            responses: {
              invalidQuestionId: { answer: "YES" },
              "4": { answer: "YES" },
            },
          },
        ],
      },
    });

    await testHandleHomeAssessment(req, res);

    expect(res._getStatusCode()).toEqual(400);
    expect(JSON.parse(res._getData())).toEqual({
      errors: [{ msg: "question with id 3 is left unanswered for type BED" }],
    });
  });

  it("returns 200 when providing valid inputs", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
        rooms: [
          {
            ...MOCK_ROOM,
            responses: {
              "3": { answer: "NO" },
              "4": { answer: "NO" },
            },
          },
        ],
      },
    });

    await testHandleHomeAssessment(req, res);

    expect(res._getStatusCode()).toEqual(200);
    const result = JSON.parse(res._getData()) as ApiHomeAssessmentResult;
    expect(result.details).toEqual(MOCK_DETAILS);
    expect(result.generatedDate).toBeDefined();
    expect(result.rooms).toEqual([
      {
        id: "randomId",
        name: "Bedroom 1",
        violations: [],
        possibleViolations: [],
      },
    ]);
  });

  it("returns violations when conditions are met", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
        rooms: [
          {
            ...MOCK_ROOM,
            responses: {
              "3": { answer: "NO" },
              "4": { answer: "YES" },
            },
          },
        ],
      },
    });

    await testHandleHomeAssessment(req, res);

    expect(res._getStatusCode()).toEqual(200);
    const result = JSON.parse(res._getData()) as ApiHomeAssessmentResult;
    expect(result.details).toEqual(MOCK_DETAILS);
    expect(result.generatedDate).toBeDefined();
    expect(result.rooms).toEqual([
      {
        id: "randomId",
        name: "Bedroom 1",
        possibleViolations: [],
        violations: [
          {
            id: "id2",
            description: "Test 1 description",
            name: "2.0 Violation",
            userProvidedDescriptions: [],
          },
        ],
      },
    ]);
  });

  it("invokes datastore on validated inputs", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
        rooms: [
          {
            ...MOCK_ROOM,
            responses: {
              "3": { answer: "NO" },
              "4": { answer: "YES" },
            },
          },
        ],
      },
    });

    const moockedSaveHomeAssessmentInput = jest.fn(
      () => new Promise<[true, null]>((resolve) => resolve([true, null]))
    );
    const mockedSaveHomeAssessmentResult = jest.fn(
      () => new Promise<[true, null]>((resolve) => resolve([true, null]))
    );

    const store: Datastore = {
      saveHomeAssessmentInput: moockedSaveHomeAssessmentInput,
      saveHomeAssessmentResult: mockedSaveHomeAssessmentResult,
    };

    await testHandleHomeAssessment(req, res, store);
    expect(res._getStatusCode()).toEqual(200);
    expect(moockedSaveHomeAssessmentInput).toBeCalled();
    expect(mockedSaveHomeAssessmentResult).toBeCalled();
  });
});
