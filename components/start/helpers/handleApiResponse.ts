import unfetch from "unfetch";

type ResponseError = { msg: string };

export async function handleApiResponse(
  request: Promise<unfetch.IsomorphicResponse>
) {
  const errors: ResponseError[] = [];
  let successful = false;
  let responseBody: { [key: string]: unknown } | undefined;

  try {
    const response = await request;
    responseBody = (await response.json()) as {
      [key: string]: unknown;
    };

    if (response.status === 200) {
      successful = true;
    } else if ("errors" in responseBody && Array.isArray(responseBody.errors)) {
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
    responseBody = undefined;
    console.error(error);
    errors.push({ msg: "An unknown error occurred..." });
  }

  return { errors, successful, responseBody };
}
