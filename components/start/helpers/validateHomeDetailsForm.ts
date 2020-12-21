import { HomeDetails } from "../../../interfaces/home-assessment";
import { validatePrice } from "./validatePrice";

export function validateHomeDetailsForm(details: Partial<HomeDetails>) {
  let isLandlordOtherFieldValid = true;
  if (details.landlord === "Other") {
    isLandlordOtherFieldValid = details.landlordOther !== undefined;
  }

  const isValid = [
    validatePrice(details.totalRent),
    details.address !== undefined,
    details.landlord !== undefined,
    isLandlordOtherFieldValid,
    details.rentalType !== undefined,
  ];

  return !isValid.includes(false);
}
