import {
  ApiHomeAssessmentInputWithRoomIds,
  ApiHomeAssessmentResult,
} from "../../interfaces/api-home-assessment";
import { ApiUserInfo } from "../../interfaces/api-user-info";
import { HomeDetails } from "../../interfaces/home-assessment";

export interface Datastore {
  saveHomeAssessmentInput: (
    input: ApiHomeAssessmentInputWithRoomIds
  ) => Promise<[boolean, Error | null]>;
  saveHomeDetails: (
    submissionId: string,
    details: HomeDetails
  ) => Promise<[boolean, Error | null]>;
  saveHomeAssessmentResult: (
    submissionId: string,
    result: ApiHomeAssessmentResult
  ) => Promise<[boolean, Error | null]>;
  saveUserInfo: (details: ApiUserInfo) => Promise<[boolean, Error | null]>;
  fetchHomeDetailsById: (
    submissionId: string
  ) => Promise<[HomeDetails | null, Error | null]>;
}
