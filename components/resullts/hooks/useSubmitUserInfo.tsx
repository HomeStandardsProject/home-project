import * as React from "react";
import { ApiUserInfo } from "../../../interfaces/api-user-info";
import { handleApiResponse } from "../../start/helpers/handleApiResponse";

const API_SUBMIT_EMAIL = "/api/user/submit";

function generateSubmitUserEmail(inputs: ApiUserInfo) {
  return fetch(API_SUBMIT_EMAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });
}

export function useSubmitUserInfo() {
  const [loading, setLoading] = React.useState(false);

  const submitUserInfo = React.useCallback(async (details: ApiUserInfo) => {
    setLoading(true);

    const request = generateSubmitUserEmail(details);
    const { errors, successful } = await handleApiResponse(request);

    setLoading(false);
    return { errors, successful };
  }, []);

  return { loading, submitUserInfo };
}
