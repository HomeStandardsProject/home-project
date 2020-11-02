import {
  ApiHomeAssessmentInputWithRoomIds,
  ApiHomeAssessmentResult,
} from "../../interfaces/api-home-assessment";

export interface Datastore {
  saveHomeAssessmentInput: (
    submissionId: string,
    input: ApiHomeAssessmentInputWithRoomIds
  ) => Promise<[boolean, Error | null]>;
  saveHomeAssessmentResult: (
    submissionId: string,
    result: ApiHomeAssessmentResult
  ) => Promise<[boolean, Error | null]>;
}
