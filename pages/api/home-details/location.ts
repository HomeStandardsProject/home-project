import { NextApiRequest, NextApiResponse } from "next";

import { MockGeocoder } from "../../../api-functions/geocoding/MockGeocoder";
import { GoogleMapsGeocoder } from "../../../api-functions/geocoding/GoogleMapsGeocoder";
import { Geocoder } from "../../../api-functions/geocoding/Geocoder";
import { handleHomeDetailsLocation } from "../../../api-functions/handleHomeDetailsLocation/handleHomeDetailsLocation";
import { fetchAvailableCities } from "../../../api-functions/cms/ContentfulCities";
import { ContentfulCity } from "../../../interfaces/contentful-city";

async function curriedHandler(req: NextApiRequest, res: NextApiResponse) {
  let geocoder: Geocoder;
  if (process.env.GOOGLE_MAPS_API_KEY) {
    geocoder = new GoogleMapsGeocoder(process.env.GOOGLE_MAPS_API_KEY);
  } else {
    console.warn(
      "Google Maps API key not provided, defaulting to mock service"
    );
    geocoder = new MockGeocoder();
  }

  let availableCities: Array<ContentfulCity>;
  if (process.env.CONTENTFUL_API_KEY) {
    availableCities = await fetchAvailableCities();
  } else {
    console.log("Contentful key not specified, defaulting to mock value");
    availableCities = [
      {
        id: "mock-id",
        name: "Kingston (mocked)",
        lat: 44.23334,
        long: -76.5,
        radius: "50000",
        landlords: ["Mock Landlord"],
        slug: "kingston-mocked"
      },
    ];
  }

  return handleHomeDetailsLocation(req, res, geocoder, availableCities);
}

export default curriedHandler;
