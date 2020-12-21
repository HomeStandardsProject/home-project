import { HomeDetails } from "./home-assessment";

export type ApiHomeDetailsInput = {
  details: HomeDetails;
};

export type ApiHomeDetailsResult = {
  submissionId: string;
};
