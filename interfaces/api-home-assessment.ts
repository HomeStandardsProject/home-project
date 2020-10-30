import { HomeDetails, Room } from "./home-assessment";

export type ApiRoomAssessmentQuestionResponse = {
  answer: "YES" | "NO";
  description?: string;
};

export type ApiRoom = {
  name: string;
  type: Room["type"];
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse };
};

export interface ApiHomeAssessmentInput {
  details: HomeDetails;
  rooms: ApiRoom[];
}

export interface ApiHomeAssessmentInputWithRoomIds
  extends ApiHomeAssessmentInput {
  rooms: (ApiRoom & { id: string })[];
}

export type ApiHomeAssessmentResult = {
  details: HomeDetails;
  generatedDate: Date;
  rooms: ApiRoomAssessmentResult[];
};

export type ApiBylawViolation = {
  id: string;
  name: string;
  description: string;
  userProvidedDescriptions: string[];
};

export type ApiRoomAssessmentResult = {
  id: string;
  name: string;
  violations: ApiBylawViolation[];
};

export type ApiBylawMultiplexer = {
  rules: { bylawId: string; mustBeTrue: string[]; mustBeFalse: string[] }[];
  bylaws: {
    [bylawId: string]: Pick<ApiBylawViolation, "name" | "description">;
  };
};
