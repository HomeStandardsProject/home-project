import { NextApiRequest, NextApiResponse } from "next";

import { Datastore } from "../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../api-functions/datastore/MockDatastore";

import { handleHomeDetails } from "../../api-functions/handleHomeDetails/handleHomeDetails";
import { PrismaDatastore } from "../../api-functions/datastore/PrismaDatastore";

function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  let datastore: Datastore;
  if (process.env.AIRTABLE_SUBMISSIONS_BASE && process.env.AIRTABLE_API_KEY) {
    datastore = new PrismaDatastore();
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }

  return handleHomeDetails(req, res, datastore);
}

export default curriedHandler;
