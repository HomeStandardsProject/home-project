import { NextApiRequest, NextApiResponse } from "next";

import { Datastore } from "../../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../../api-functions/datastore/MockDatastore";

import handleHomeDetailsBySubmissionId from "../../../api-functions/handleHomeDetailsBySubmissionId/handleHomeDetailsBySubmissionId";
import { PrismaDatastore } from "../../../api-functions/datastore/PrismaDatastore";

async function homeDetailsBySubmisionId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let datastore: Datastore;
  if (process.env.DATABASE_URL) {
    datastore = new PrismaDatastore();
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  return handleHomeDetailsBySubmissionId(req, res, datastore);
}

export default homeDetailsBySubmisionId;
