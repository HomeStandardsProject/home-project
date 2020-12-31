import fetch from "isomorphic-unfetch";
import { UNKNOWN_ERROR } from "../../utils/apiErrors";
import { Geocoder } from "./Geocoder";

type GoogleMapsResult = {
  // eslint-disable-next-line camelcase
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export class GoogleMapsGeocoder implements Geocoder {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocodedSuggestionsFromQueryString(
    query: string,
    biasLat: number,
    biasLong: number,
    radius: string
  ) {
    const baseUrl =
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
    const queryParams = {
      input: query.replace(" ", "+"),
      inputtype: "textquery",
      locationbias: `circle:${radius}@${biasLat},${biasLong}`,
      fields: "geometry,formatted_address",
      key: this.apiKey,
    };

    const response = await fetch(constructURL(baseUrl, queryParams), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = (await response.json()) as {
      [key: string]: unknown;
    };

    if (response.status === 200) {
      const { candidates } = responseBody as { candidates: unknown[] };
      if (candidates.length > 0) {
        return candidates.map((candiate) => {
          const result = candiate as GoogleMapsResult;
          return {
            address: result.formatted_address,
            lat: `${result.geometry.location.lat}`,
            long: `${result.geometry.location.lng}`,
          };
        });
      }
      return null;
    }
    console.error(responseBody);
    throw UNKNOWN_ERROR;
  }
}

function constructURL(baseURL: string, params: { [key: string]: string }) {
  const queryString = Object.keys(params)
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return `${baseURL}?${queryString}`;
}
