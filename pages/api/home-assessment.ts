import { NextApiRequest, NextApiResponse } from "next";

import {
  handleHomeAssessment,
  ParsedCityRules,
} from "../../api-functions/handleHomeAssessment/handleHomeAssessment";

import { Datastore } from "../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../api-functions/datastore/MockDatastore";

import { PrismaDatastore } from "../../api-functions/datastore/PrismaDatastore";
import { fetchAvailableCitiesWithRules } from "../../api-functions/cms/ContentfulCities";
import { loadQuestionsFromJSON } from "../../utils/loadQuestions";
import { loadBylawMultiplexerFromData } from "../../utils/loadBylawMultiplexer";

async function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  let datastore: Datastore;
  if (process.env.DATABASE_URL) {
    datastore = new PrismaDatastore();
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  // this approach to passing all the questions for EVERY city
  // probably won't scale well (could be a lot of data which will take up page size),
  // it should be fine for now and can be addressed once its a problem.
  const availableCities = await fetchAvailableCitiesWithRules();
  const cityWithParsedRules = Array<ParsedCityRules>();
  for (const city of availableCities) {
    // Unsused return value, however this is to make sure that the bylaw multiplexer
    // is validated at build time rather then at execution time
    const questions = loadQuestionsFromJSON(city.questions);
    const bylawMultiplexer = loadBylawMultiplexerFromData(
      city.bylawMultiplexer,
      questions
    );
    cityWithParsedRules.push({ name: city.name, questions, bylawMultiplexer });
  }

  return handleHomeAssessment(req, res, cityWithParsedRules, datastore);
}

export default curriedHandler;
