import { NextApiRequest, NextApiResponse } from "next";
import { UNKNOWN_ERROR } from "../../utils/apiErrors";

import { Datastore } from "../datastore/Datastore";

async function homeDetailsBySubmisionId(
  req: NextApiRequest,
  res: NextApiResponse,
  datastore: Datastore
) {
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
