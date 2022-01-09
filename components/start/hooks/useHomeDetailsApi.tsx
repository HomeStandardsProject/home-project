import * as React from "react";
import fetch from "unfetch";

import {
  ApiHomeDetailsInput,
  ApiHomeDetailsResult,
} from "../../../interfaces/api-home-details";
import { HomeDetails } from "../../../interfaces/home-assessment";
import { handleApiResponse } from "../helpers/handleApiResponse";

export const API_HOME_DETAILS_PATH = "/api/home-details";
export const LOCAL_STORAGE_SUBMISSION_ID_KEY = "submissionId";

function generateHomeDetailsPostRequest(inputs: ApiHomeDetailsInput) {
  return fetch(API_HOME_DETAILS_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });
}

export function useHomeDetailsApi() {
  const [loading, setLoading] = React.useState(false);

  const submitHomeDetails = React.useCallback(async (details: HomeDetails) => {
    setLoading(true);

    const apiDetails: HomeDetails = {
      address: returnValueOrThrowError({ address: details.address }),
      unitNumber: details.unitNumber,
      numberOfBedrooms: details.numberOfBedrooms,
      rentalType: returnValueOrThrowError({ rentalType: details.rentalType }),
      totalRent: returnValueOrThrowError({ totalRent: details.totalRent }),
      landlord: returnValueOrThrowError({ landlord: details.landlord }),
      landlordOther: details.landlordOther,
      waterInRent: details.waterInRent,
      hydroInRent: details.hydroInRent,
      gasInRent: details.gasInRent,
      internetInRent: details.internetInRent,
      otherInRent: details.otherInRent,
      otherValue: details.otherValue,
    };

    const request = generateHomeDetailsPostRequest({
      details: apiDetails,
    });
    const { errors, successful, responseBody } = await handleApiResponse(
      request
    );

    if (successful) {
      const validatedResponse = responseBody as ApiHomeDetailsResult;
      localStorage.setItem(
        LOCAL_STORAGE_SUBMISSION_ID_KEY,
        validatedResponse.submissionId
      );
    }

    setLoading(false);
    return { errors, successful };
  }, []);

  return { loading, submitHomeDetails };
}

function returnValueOrThrowError<T>(obj: {
  [name: string]: T | null | undefined;
}): T {
  const getVariableName = (object: Record<string, unknown>) =>
    Object.keys(object)[0];

  const value = obj[getVariableName(obj)];

  if (value !== undefined && value !== null) {
    return value;
  }
  throw new Error(`${getVariableName(obj)} is not defined`);
}
