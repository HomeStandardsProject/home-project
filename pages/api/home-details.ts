import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

import { AirtableStore } from "../../api-functions/datastore/Airtable";
import { Datastore } from "../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../api-functions/datastore/MockDatastore";

import { handleHomeDetails } from "../../api-functions/handleHomeDetails/handleHomeDetails";

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
  apiVersion: undefined,
  endpointUrl: undefined,
  noRetryIfRateLimited: undefined,
});

function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  let datastore: Datastore;
  if (process.env.AIRTABLE_SUBMISSIONS_BASE && process.env.AIRTABLE_API_KEY) {
    datastore = new AirtableStore(process.env.AIRTABLE_SUBMISSIONS_BASE);
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  return handleHomeDetails(req, res, datastore);
}

export default curriedHandler;
