import * as React from "react";
import fetch from "unfetch";
import {
  ApiHomeAssessmentInput,
  ApiRoom,
  ApiRoomAssessmentQuestionResponse,
} from "../../../interfaces/api-home-assessment";
import {
  HomeAssessmentData,
  HomeDetails,
  RoomAssessmentQuestionResponse,
} from "../../../interfaces/home-assessment";
import { NormalizedRoom } from "../helpers/normalizeRooms";

export const API_HOME_ASSESSMENT_PATH = "/api/home-assessment";
export const LOCAL_STORAGE_ASSESSMENT_KEY = "assessment";

function generateAssessmentPostRequest(inputs: ApiHomeAssessmentInput) {
  return fetch(API_HOME_ASSESSMENT_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });
}

type ResponseError = { msg: string };
export function useAssessmentCalculatorApi() {
  const [loading, setLoading] = React.useState(false);

  const generateAssessment = React.useCallback(
    async (rooms: NormalizedRoom[], details: HomeAssessmentData["details"]) => {
      const apiRooms = rooms.map(
        (room): ApiRoom => ({
          name: room.name,
          responses: transformResponseToTypesafeDefined(room.responses),
          type: room.type,
        })
      );

      const apiDetails: HomeDetails = {
        address: returnValueOrThrowError({ address: details.address }),
        rentalType: returnValueOrThrowError({ rentalType: details.rentalType }),
        totalRent: returnValueOrThrowError({ totalRent: details.totalRent }),
        landlord: returnValueOrThrowError({ landlord: details.landlord }),
        landlordOther: details.landlordOther,
      };

      setLoading(true);
      const errors: ResponseError[] = [];
      let successful = false;
      try {
        const response = await generateAssessmentPostRequest({
          rooms: apiRooms,
          details: apiDetails,
        });
        const responseBody = (await response.json()) as {
          [key: string]: unknown;
        };

        if (response.status === 200) {
          localStorage.setItem(
            LOCAL_STORAGE_ASSESSMENT_KEY,
            JSON.stringify(responseBody)
          );
          successful = true;
        } else if (response.status === 404 && "generatedDate" in responseBody) {
          // temporary branch... Only here because when deployed the api route is returning 404's for some
          // reason, but the api response is being returned correctly.
          localStorage.setItem(
            LOCAL_STORAGE_ASSESSMENT_KEY,
            JSON.stringify(responseBody)
          );
          successful = true;
        } else if (
          "errors" in responseBody &&
          Array.isArray(responseBody.errors)
        ) {
          const validatedErrors: ResponseError[] = [];
          for (const error of responseBody.errors) {
            if (error && typeof error === "object" && "msg" in error) {
              validatedErrors.push(error);
            } else {
              console.error("Unable to parse error", error);
            }
          }
          errors.push(...validatedErrors);
        } else {
          console.error(responseBody);
          errors.push({ msg: "An unknown error occurred..." });
        }
      } catch (error) {
        console.error(error);
        errors.push({ msg: "An unknown error occurred..." });
      }
      setLoading(false);
      return { errors, successful };
    },
    []
  );

  return { generatingAssessment: loading, generateAssessment };
}

function transformResponseToTypesafeDefined(response: {
  [questionId: string]: RoomAssessmentQuestionResponse;
}) {
  const newResponses: {
    [questionId: string]: ApiRoomAssessmentQuestionResponse;
  } = {};

  for (const questionId of Object.keys(response)) {
    newResponses[questionId] = {
      answer: returnValueOrThrowError({
        [questionId]: response[questionId].answer,
      }),
      description: response[questionId].description,
    };
  }
  return newResponses;
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
