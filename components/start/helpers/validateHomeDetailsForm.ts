import { HomeDetails } from "../../../interfaces/home-assessment";
import { validatePrice } from "./validatePrice";

export function validateHomeDetailsForm(details: Partial<HomeDetails>) {
  let isLandlordOtherFieldValid = true;
  if (details.landlord === "Other") {
    isLandlordOtherFieldValid = details.landlordOther !== undefined;
  }

  // const detailsRequired = details.otherInRent;

  const isValid = [
    validatePrice(details.totalRent),
    details.address !== undefined,
    details.landlord !== undefined,
    isLandlordOtherFieldValid,
    details.rentalType !== undefined,
    details.numberOfBedrooms !== undefined,
    details.waterInRent !== undefined,
    details.hydroInRent !== undefined,
    details.gasInRent !== undefined,
    details.internetInRent !== undefined,
    details.parkingInRent !== undefined,
    details.otherInRent !== undefined,
    details.otherInRent === "NO" ||
      (details.otherInRent === "YES" && details.otherValue !== undefined),
  ];

  return !isValid.includes(false);
}
