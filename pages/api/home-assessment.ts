import { NextApiRequest, NextApiResponse } from "next";
import { check, validationResult } from "express-validator";
import {
  ROOM_TYPES,
  RENTAL_TYPES,
  LANDLORDS,
} from "../../interfaces/home-assessment";
import { validateMiddleware } from "../../util/api/validation";

const validateSchema = validateMiddleware(
  [
    check("details.address").isString(),
    // .map is a workaround to a typescript readonly issue
    check("details.rentalType").isIn(RENTAL_TYPES.map((i) => i)),
    check("details.totalRent").isString(),
    check("details.landlord").isIn(LANDLORDS.map((i) => i)),
    check("details.landlordOther").optional({ nullable: true }).isString(),

    check("rooms.*.type").isIn(ROOM_TYPES.map((i) => i)),
    check("rooms.*.responses").exists(),
    check("rooms.*.responses.*.answer").isIn(["YES", "NO"]),
    check("rooms.*.responses.*.description")
      .optional({ nullable: true })
      .isString(),
  ],
  validationResult
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const validationErrors = await validateSchema(req);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors.array() });

    return res.status(200).json({ hello: true });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
}

export default handler;
