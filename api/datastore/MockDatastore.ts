import { Datastore } from "./Datastore";

export class MockDatastore implements Datastore {
  // eslint-disable-next-line class-methods-use-this
  async saveHomeAssessmentInput(): Promise<[boolean, Error | null]> {
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
}
