import * as React from "react";
import {
  ApiHomeDetailsLocationInput,
  ApiHomeDetailsLocationResult,
} from "../../../../interfaces/api-home-details";
import { handleApiResponse } from "../../helpers/handleApiResponse";

const API_HOME_DETAILS_LOCATION_PATH = "/api/home-details/location";

function generateLocationRequest(inputs: ApiHomeDetailsLocationInput) {
  const esc = encodeURIComponent;
  return fetch(
    `${API_HOME_DETAILS_LOCATION_PATH}?query=${esc(inputs.query)}&city=${esc(
      inputs.city
    )}`,
    {
      method: "GET",
    }
  );
}

export function useHomeDetailsLocationApi(city: string) {
  const [loading, setLoading] = React.useState(false);

  const fetchMachingLocations = React.useCallback(async (query: string) => {
    setLoading(true);

    const request = generateLocationRequest({ query, city });
    const { errors, successful, responseBody } = await handleApiResponse(
      request
    );

    let locationResults: ApiHomeDetailsLocationResult;
    if (successful && responseBody) {
      locationResults = responseBody as ApiHomeDetailsLocationResult;
    } else {
      locationResults = { matches: [] };
    }

    setLoading(false);
    return { errors, successful, locationResults };
  }, []);

  return { loading, fetchMachingLocations };
}
