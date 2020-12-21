import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

import { AirtableStore } from "../../../api-functions/datastore/Airtable";
import { Datastore } from "../../../api-functions/datastore/Datastore";
import { MockDatastore } from "../../../api-functions/datastore/MockDatastore";
import { UNKNOWN_ERROR } from "../../../utils/apiErrors";

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
    datastore = new AirtableStore(process.env.AIRTABLE_SUBMISSIONS_BASE);
  } else {
    console.warn("Airtable base not provided, defaulting to mock datastore");
    datastore = new MockDatastore();
  }
  const { submissionId } = req.query;
  if (!submissionId || typeof submissionId !== "string") {
    return res.status(400).end();
  }

  const [retrievedHomeDetails, error] = await datastore.fetchHomeDetailsById(
    submissionId
  );

  // 5 minute cache
  res.setHeader("Cache-Control", "max-age=1, stale-while-revalidate=300");

  if (retrievedHomeDetails) {
    return res.status(200).json(retrievedHomeDetails);
  }

  if (error === UNKNOWN_ERROR) {
    res.status(500);
  } else {
    res.status(400);
  }
  return res.json({ errors: [{ msg: error?.message }] });
}

export default homeDetailsBySubmisionId;
