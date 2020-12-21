import { HomeDetails } from "../../interfaces/home-assessment";
import { Datastore } from "./Datastore";

export class MockDatastore implements Datastore {
  // eslint-disable-next-line class-methods-use-this
  async saveHomeAssessmentInput(): Promise<[boolean, Error | null]> {
    return new Promise((resolve) => {
      resolve([true, null]);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async saveHomeDetails(): Promise<[boolean, Error | null]> {
    return new Promise((resolve) => {
      resolve([true, null]);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async saveHomeAssessmentResult(): Promise<[boolean, Error | null]> {
    return new Promise((resolve) => {
      resolve([true, null]);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchHomeDetailsById(): Promise<[HomeDetails | null, Error | null]> {
    return new Promise((resolve) => {
      resolve([
        {
          address: "Fake Address",
          rentalType: "Apartment",
          landlord: "Frontenac Property Management",
          totalRent: "900.0",
        },
        null,
      ]);
    });
  }
}
