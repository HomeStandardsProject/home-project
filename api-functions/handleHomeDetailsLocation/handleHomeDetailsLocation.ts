import { NextApiRequest, NextApiResponse } from "next";

import { Geocoder } from "../geocoding/Geocoder";

import { ApiHomeDetailsLocationResult } from "../../interfaces/api-home-details";
import { ContentfulCity } from "../../interfaces/contentful-city";

export async function handleHomeDetailsLocation(
  req: NextApiRequest,
  res: NextApiResponse,
  geocoder: Geocoder,
  availableCities: ContentfulCity[]
) {
  const { query, city } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).send("location query not provided");
  }

  if (!city || typeof city !== "string") {
    return res.status(400).send("city not provided");
  }
  const selectedContentfulCities = availableCities.filter(
    (contentfulCity) => contentfulCity.name.toLowerCase() === city.toLowerCase()
  );
  if (selectedContentfulCities.length !== 1) {
    return res.status(400).send("city is not supported");
  }
  const selectedCity = selectedContentfulCities[0];

  try {
    const geocodedAddresses = await geocoder.geocodedSuggestionsFromQueryString(
      query,
      selectedCity.lat,
      selectedCity.long,
      selectedCity.radius
    );

    if (!geocodedAddresses) {
      return res.status(400).json({ errors: [{ msg: "Address is invalid" }] });
    }
    // Kinda hacky... Address validation is hard. Google doesn't seem to offer a way to restrict results
    // to be within the location bias.
    const filteredAddresses = geocodedAddresses.filter((candidate) =>
      candidate.address.includes(city)
    );
    const result: ApiHomeDetailsLocationResult = { matches: filteredAddresses };
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send([{ msg: "an unknown error occurred" }]);
  }
}
