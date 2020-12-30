import * as React from "react";
import fetch from "unfetch";
import {
  ApiHomeAssessmentInput,
  ApiRoom,
  ApiRoomAssessmentQuestionResponse,
} from "../../../../interfaces/api-home-assessment";
import {
  isGeneralRoomType,
  Room,
  RoomAssessmentQuestionResponse,
} from "../../../../interfaces/home-assessment";
import { normalizeRoomNames } from "../helpers/normalizeRooms";
import { handleApiResponse } from "../../helpers/handleApiResponse";
import { LOCAL_STORAGE_SUBMISSION_ID_KEY } from "../../hooks/useHomeDetailsApi";

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

export function useAssessmentCalculatorApi() {
  const [loading, setLoading] = React.useState(false);

  const generateAssessment = React.useCallback(
    async (rooms: Room[], submissionId: string) => {
      setLoading(true);

      const apiRooms = normalizeRoomNames(rooms)
        .filter((room) => {
          // remove general rooms that were not answered
          if (isGeneralRoomType(room.type) && room.responses) {
            if (Object.keys(room.responses).length === 0) {
              return false;
            }
          }
          return true;
        })
        .map(
          (room): ApiRoom => ({
            name: room.name,
            responses: transformResponseToTypesafeDefined(room.responses),
            type: room.type,
          })
        );

      const request = generateAssessmentPostRequest({
        submissionId,
        rooms: apiRooms,
      });
      const { errors, successful, responseBody } = await handleApiResponse(
        request
      );

      if (successful) {
        localStorage.removeItem(LOCAL_STORAGE_SUBMISSION_ID_KEY);
        localStorage.setItem(
          LOCAL_STORAGE_ASSESSMENT_KEY,
          JSON.stringify(responseBody)
        );
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
      selectedMultiselect: response[questionId].selectedMultiselect?.join(","),
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
