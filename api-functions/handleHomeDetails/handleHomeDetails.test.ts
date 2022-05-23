import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { createMocks } from "node-mocks-http";

import { MockDatastore } from "../datastore/MockDatastore";
import { generateSetOfNullifiedFields } from "../utils/generateSetOfNullifiedFields";
import { RecursiveRequiredObject } from "../utils/RecursiveRequiredObject";
import { handleHomeDetails } from "./handleHomeDetails";
import { Datastore } from "../datastore/Datastore";
import {
  ApiHomeDetailsInput,
  ApiHomeDetailsResult,
} from "../../interfaces/api-home-details";

jest.mock("uuid");

const MOCK_DETAILS: ApiHomeDetailsInput["details"] = {
  city: "Kingston",
  landlord: "Frontenac Property Management",
  rentalType: "Full house",
  totalRent: "499.99",
  numberOfBedrooms: 2,
  address: {
    userProvided: "99 University",
    formatted: "99 University, Kingston, Ontario",
    long: "0.00",
    lat: "0.00",
  },
};

const ONLY_REQUIRED_MOCK_INPUTS: RecursiveRequiredObject<ApiHomeDetailsInput> = {
  details: MOCK_DETAILS,
};

const testHandleHomeDetails = (
  req: NextApiRequest,
  res: NextApiResponse,
  datastore: Datastore = new MockDatastore()
) => handleHomeDetails(req, res, datastore);

describe("/api/start/details", () => {
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

      await testHandleHomeDetails(req, res);

      const statusCode = res._getStatusCode();
      const response = JSON.parse(res._getData());
      if (statusCode !== 400 && response !== validationError(nullCase.name)) {
        fail(`Unimplemented existence validator for property ${nullCase.name}`);
      }
    }
  });

  it("returns 400 when rent price is negative", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: { ...MOCK_DETAILS, totalRent: "-9.99" },
      },
    });

    await testHandleHomeDetails(req, res);

    expect(res._getStatusCode()).toEqual(400);
    expect(JSON.parse(res._getData())).toEqual({
      errors: [
        {
          location: "body",
          msg: "Invalid value",
          param: "details.totalRent",
          value: "-9.99",
        },
      ],
    });
  });

  it("returns 400 when landlord other is not defined", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: { ...MOCK_DETAILS, landlord: "Other", landlordOther: null },
      },
    });

    await testHandleHomeDetails(req, res);

    expect(res._getStatusCode()).toEqual(400);
    expect(JSON.parse(res._getData())).toEqual({
      errors: [
        {
          location: "body",
          msg:
            "details.landlordOther must be defined when landlord is set to 'Other'",
          param: "details.landlordOther",
          value: null,
        },
      ],
    });
  });

  it("returns 200 when providing valid inputs", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
      },
    });

    await testHandleHomeDetails(req, res);

    expect(res._getStatusCode()).toEqual(200);
    const result = JSON.parse(res._getData()) as ApiHomeDetailsResult;
    expect(result.submissionId).toEqual("randomId");
  });

  it("invokes datastore on validated inputs", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        details: MOCK_DETAILS,
      },
    });

    const mockedSaveHomeDetails = jest.fn(
      () => new Promise<[true, null]>((resolve) => resolve([true, null]))
    );

    const store: Datastore = new MockDatastore();
    store.saveHomeDetails = mockedSaveHomeDetails;

    await testHandleHomeDetails(req, res, store);
    expect(res._getStatusCode()).toEqual(200);
    expect(mockedSaveHomeDetails).toBeCalled();
  });
});
