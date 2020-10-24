import { createMocks } from "node-mocks-http";
import { ApiHomeAssessmentInput } from "../../../interfaces/api-home-assessment";
import { generateSetOfNullifiedFields } from "../../../util/api/generateSetOfNullifiedFields";
import { RecursiveRequiredObject } from "../../../util/RecursiveRequiredObject";

import handleHomeAssessment from "../home-assessment";

const ONLY_REQUIRED_MOCK_INPUTS: RecursiveRequiredObject<ApiHomeAssessmentInput> = {
  details: {
    landlord: "Frontenac Property Management",
    rentalType: "Full-house",
    totalRent: "499.99",
    address: "99 University Ave, Kingston, ON",
  },
  rooms: [
    {
      type: "LIVING",
      responses: {
        questionId1: {
          answer: "YES",
        },
      },
    },
  ],
};

const validationError = (param: string) => ({
  errors: [{ location: "body", msg: "Invalid value", param }],
});

describe("/api/home-assessment", () => {
  it("implements basic existence validation for all parameters", async () => {
    const nullifiedFields = generateSetOfNullifiedFields(
      ONLY_REQUIRED_MOCK_INPUTS
    );
    for (const nullCase of nullifiedFields) {
      const { req, res } = createMocks({
        method: "POST",
        body: nullCase.case,
      });

      await handleHomeAssessment(req, res);

      const statusCode = res._getStatusCode();
      const response = JSON.parse(res._getData());
      if (statusCode !== 400 && response !== validationError(nullCase.name)) {
        fail(`Unimplemented existence validator for property ${nullCase.name}`);
      }
    }
  });
});
