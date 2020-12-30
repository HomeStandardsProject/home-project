import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { ApiUserInfo } from "../../interfaces/api-user-info";
import { Datastore } from "../datastore/Datastore";
import { MockDatastore } from "../datastore/MockDatastore";
import { generateSetOfNullifiedFields } from "../utils/generateSetOfNullifiedFields";
import { RecursiveRequiredObject } from "../utils/RecursiveRequiredObject";
import { handleSubmitUserInfo } from "./handleSubmitUserInfo";

const ONLY_REQUIRED_MOCK_INPUTS: RecursiveRequiredObject<ApiUserInfo> = {
  email: "fake.email@gmail.com",
  subscribeToNewsletter: false,
};

const testSubmitUserInfo = (
  req: NextApiRequest,
  res: NextApiResponse,
  datastore: Datastore = new MockDatastore()
) => handleSubmitUserInfo(req, res, datastore);

describe("/api/user/submit", () => {
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

      await testSubmitUserInfo(req, res);

      const statusCode = res._getStatusCode();
      const response = JSON.parse(res._getData());
      if (statusCode !== 400 && response !== validationError(nullCase.name)) {
        fail(`Unimplemented existence validator for property ${nullCase.name}`);
      }
    }
  });
});
