import {
  ResultFactory,
  ValidationChain,
  ValidationError,
} from "express-validator";
import { NextApiRequest } from "next";

// sourced from https://dev.to/meddlesome/nextjs-apis-validator-with-middleware-3njl
export function validateMiddleware(
  validations: ValidationChain[],
  validationResult: ResultFactory<ValidationError>
) {
  return async (req: NextApiRequest) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    return errors.isEmpty() ? null : errors;
  };
}
