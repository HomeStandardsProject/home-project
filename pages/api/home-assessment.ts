import { NextApiRequest, NextApiResponse } from "next";

import { handleHomeAssessment } from "../../api-functions/handleHomeAssessment/handleHomeAssessment";

import { Datastore } from "../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../api-functions/datastore/MockDatastore";
import { loadQuestions } from "../../utils/loadQuestions";
import { loadBylawMultiplexer } from "../../utils/loadBylawMultiplexer";
import { PrismaDatastore } from "../../api-functions/datastore/PrismaDatastore";

const questions = loadQuestions();
const multiplexer = loadBylawMultiplexer(questions);

function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  let datastore: Datastore;
  if (process.env.DATABASE_URL) {
    datastore = new PrismaDatastore();
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  return handleHomeAssessment(req, res, multiplexer, questions, datastore);
}

export default curriedHandler;
