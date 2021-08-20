import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

import { Datastore } from "../../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../../api-functions/datastore/MockDatastore";

import { handleSubmitUserInfo } from "../../../api-functions/handleSubmitUserInfo/handleSubmitUserInfo";
import { PrismaDatastore } from "../../../api-functions/datastore/PrismaDatastore";

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
  apiVersion: undefined,
  endpointUrl: undefined,
  noRetryIfRateLimited: undefined,
});

async function homeDetailsBySubmisionId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let datastore: Datastore;
  if (process.env.AIRTABLE_SUBMISSIONS_BASE && process.env.AIRTABLE_API_KEY) {
    datastore = new PrismaDatastore();
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  return handleSubmitUserInfo(req, res, datastore);
}

export default homeDetailsBySubmisionId;
