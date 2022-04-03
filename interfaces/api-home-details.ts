import { HomeDetails } from "./home-assessment";

export type ApiHomeDetailsInput = {
  details: HomeDetails;
};

export type ApiHomeDetailsResult = {
  submissionId: string;
};

export type ApiHomeDetailsLocationInput = {
  query: string;
};

export type ApiHomeDetailsLocationResult = {
  matches: {
    address: string;
    long: string;
    lat: string;
  }[];
};
