import { HomeDetails, Room } from "./home-assessment";

export type ApiRoomAssessmentQuestionResponse = {
  answer: "YES" | "NO";
  description?: string;
};

export type ApiRoom = {
  type: Room["type"];
  responses: { [questionId: string]: ApiRoomAssessmentQuestionResponse };
};

export type ApiHomeAssessmentInput = {
  details: HomeDetails;
  rooms: ApiRoom[];
};

export type ApiHomeAssessmentResult = {
  details: HomeDetails;
  generatedDate: Date;
  rooms: ApiRoomAssessmentResult[];
};

export type ApiRoomInfraction = {
  bylawId: string;
  bylawDescription: string;
};

export type ApiRoomViolation = {
  infractions: ApiRoomInfraction[];
  userProvidedDescription: string;
};

export type ApiRoomAssessmentResult = {
  id: string;
  name: string;
  violations: ApiRoomViolation[];
};
