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

async function generateAssessmentPostRequest(inputs: ApiHomeAssessmentInput) {
  console.log("bonjour");
  const result = await fetch(API_HOME_ASSESSMENT_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });
  console.log("sup");
  console.log(await result.json());
  return result;
}

type ResponseError = { msg: string };
export function useAssessmentCalculatorApi() {
  const [loading, setLoading] = React.useState(false);

  const generateAssessment = React.useCallback(
    async (rooms: NormalizedRoom[], details: HomeAssessmentData["details"]) => {
      const apiRooms = rooms.map(
        (room): ApiRoom => ({
          id: room.id,
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
        console.log("me");
        const response = await generateAssessmentPostRequest({
          rooms: apiRooms,
          details: apiDetails,
        });
        const responseBody = await response.json();
        if (response.status === 200) {
          localStorage.setItem("assessment", JSON.stringify(responseBody));
          successful = true;
        } else {
          const parsedBody = JSON.parse(responseBody);
          if ("errors" in parsedBody && Array.isArray(parsedBody.errors)) {
            const validatedErrors: ResponseError[] = [];
            for (const error of parsedBody) {
              if (error && typeof error === "object" && "msg" in error) {
                validatedErrors.push(error);
              } else {
                console.error("Unable to parse error", error);
              }
            }
            errors.push(...validatedErrors);
          } else {
            console.error(parsedBody);
            errors.push({ msg: "An unknown error occurred..." });
          }
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
