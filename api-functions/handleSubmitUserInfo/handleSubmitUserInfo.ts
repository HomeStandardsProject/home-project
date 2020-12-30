import { NextApiRequest, NextApiResponse } from "next";

import { check, validationResult } from "express-validator";

import { validateMiddleware } from "../utils/validation";

import { Datastore } from "../datastore/Datastore";
import { ApiUserInfo } from "../../interfaces/api-user-info";

const validateSchema = validateMiddleware(
  [check("email").isEmail(), check("subscribeToNewsletter").isBoolean()],
  validationResult
);

export async function handleSubmitUserInfo(
  req: NextApiRequest,
  res: NextApiResponse,
  datastore: Datastore
) {
  try {
    const validationErrors = await validateSchema(req);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors.array() });

    const input = req.body as ApiUserInfo;

    const [inputSaveResult, inputSaveError] = await datastore.saveUserInfo(
      input
    );

    if (inputSaveResult === false) {
      console.error(inputSaveError);
      return res
        .status(500)
        .json({ errors: [{ msg: "Unable to save input fields" }] });
    }

    return res.status(200).json({ successful: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ statusCode: 500, message: "An unknown error occured" });
  }
}
