import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

import KingstonBylawMultiplexer from "../../data/kingston/bylawMultiplexer.json";
import { handleHomeAssessment } from "../../api-functions/handleHomeAssessment/handleHomeAssessment";
import { ApiBylawMultiplexer } from "../../interfaces/api-home-assessment";
import { AirtableStore } from "../../api-functions/datastore/Airtable";
import { Datastore } from "../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../api-functions/datastore/MockDatastore";
import { loadQuestions } from "../../utils/loadQuestions";

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
  apiVersion: undefined,
  endpointUrl: undefined,
  noRetryIfRateLimited: undefined,
});

function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  const questions = loadQuestions();
  const multiplexer = KingstonBylawMultiplexer as ApiBylawMultiplexer;
  let datastore: Datastore;
  if (process.env.AIRTABLE_SUBMISSIONS_BASE && process.env.AIRTABLE_API_KEY) {
    datastore = new AirtableStore(process.env.AIRTABLE_SUBMISSIONS_BASE);
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  return handleHomeAssessment(req, res, multiplexer, questions, datastore);
}

export default curriedHandler;
