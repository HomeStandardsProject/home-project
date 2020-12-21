import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { check, validationResult } from "express-validator";
import {
  RENTAL_TYPES,
  LANDLORDS,
  HomeDetails,
} from "../../interfaces/home-assessment";
import { validateMiddleware } from "../utils/validation";

import { Datastore } from "../datastore/Datastore";

const validateSchema = validateMiddleware(
  [
    check("details.address").isString(),
    // .map is a workaround to a typescript readonly issue
    check("details.rentalType").isIn(RENTAL_TYPES.map((i) => i)),
    check("details.totalRent").isCurrency({ allow_negatives: false }),
    check("details.landlord").isIn(LANDLORDS.map((i) => i)),
    check("details.landlordOther")
      // if the landlord is set to other, then the value for this field must be defined
      .custom((value, { req }) => {
        if (req.body.details.landlord === "Other") {
          if (value && typeof value === "string") {
            return true;
          }
          throw new Error(
            "details.landlordOther must be defined when landlord is set to 'Other'"
          );
        }
        return true;
      }),
  ],
  validationResult
);

export async function handleHomeDetails(
  req: NextApiRequest,
  res: NextApiResponse,
  datastore: Datastore
) {
  try {
    const validationErrors = await validateSchema(req);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors.array() });

    const input = req.body.details as HomeDetails;

    const submissionId = uuidv4();
    const [inputSaveResult, inputSaveError] = await datastore.saveHomeDetails(
      submissionId,
      input
    );

    if (inputSaveResult === false) {
      console.error(inputSaveError);
      return res
        .status(500)
        .json({ errors: [{ msg: "Unable to save input fields" }] });
    }

    return res.status(200).json({ submissionId });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ statusCode: 500, message: "An unknown error occured" });
  }
}
