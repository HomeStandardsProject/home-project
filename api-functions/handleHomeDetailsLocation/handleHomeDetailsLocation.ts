import { NextApiRequest, NextApiResponse } from "next";

import { Geocoder } from "../geocoding/Geocoder";

import { ApiHomeDetailsLocationResult } from "../../interfaces/api-home-details";

const BIAS_KINGSTON = { lat: 44.233334, long: -76.5 };
// biased 50km search radius
const BIAS_RADIUS = "50000";

export async function handleHomeDetailsLocation(
  req: NextApiRequest,
  res: NextApiResponse,
  geocoder: Geocoder
) {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).send("location query not provided");
  }

  try {
    const geocodedAddresses = await geocoder.geocodedSuggestionsFromQueryString(
      query,
      BIAS_KINGSTON.lat,
      BIAS_KINGSTON.long,
      BIAS_RADIUS
    );

    if (!geocodedAddresses) {
      return res.status(400).json({ errors: [{ msg: "Address is invalid" }] });
    }
    // Kinda hacky... Address validation is hard. Google doesn't seem to offer a way to restrict results
    // to be within the location bias.
    const filteredAddresses = geocodedAddresses.filter((candidate) =>
      candidate.address.includes("Kingston")
    );
    const result: ApiHomeDetailsLocationResult = { matches: filteredAddresses };
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send([{ msg: "an unknown error occurred" }]);
  }
}
