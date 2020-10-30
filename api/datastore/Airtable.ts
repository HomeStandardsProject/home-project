import Airtable from "airtable";
import { v4 as uuidv4 } from "uuid";
import {
  ApiHomeAssessmentInput,
  ApiHomeAssessmentInputWithRoomIds,
  ApiHomeAssessmentResult,
} from "../../interfaces/api-home-assessment";
import {
  isRoomAssessmentQuestion,
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../interfaces/home-assessment";
import { Datastore } from "./Datastore";

type AirtableSubmissionRow = {
  id: string;
  address: string;
  rentalType: string;
  totalRent: number;
  landlord: string;
  landlordOther?: string;
};

type AirtableRoomRow = {
  // Needs to be an array of strings, but typescript breaks when declared as such
  submissionId: string;
  id: string;
  type: string;
} & { [questionID: string]: "YES" | "NO" };

type AirtableRoomViolationRow = {
  id: string;
  // Needs to be an array of strings, but typescript breaks when declared as such
  submissionId: string;
  roomId: string;
} & { [bylawId: string]: string };

export class AirtableStore implements Datastore {
  private _base: ReturnType<typeof Airtable.base>;

  constructor(baseId: string) {
    this._base = Airtable.base(baseId);
  }

  async saveHomeAssessmentInput(
    submissionId: string,
    input: ApiHomeAssessmentInputWithRoomIds
  ): Promise<[boolean, Error | null]> {
    try {
      // save details
      await this._base("raw_submissions").create(
        transformInputToSubmissionRow(submissionId, input)
      );
      // save room data
      await this._base("raw_rooms").create(
        transformInputToRoomRows(submissionId, input).map((row) => ({
          fields: row,
        })),
        { typecast: true }
      );

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  async saveHomeAssessmentResult(
    submissionId: string,
    result: ApiHomeAssessmentResult
  ): Promise<[boolean, Error | null]> {
    try {
      // save violations
      await this._base("submissions_room_violations").create(
        transformResultToViolationRows(submissionId, result).map((row) => ({
          fields: row,
        })),
        { typecast: true }
      );

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  async fetchQuestions() {
    const unvalidatedRecords = await this._base("questions").select().all();
    const questions: { [type in RoomTypes]: RoomAssessmentQuestion[] } = {
      BED: [],
      WASH: [],
      KITCHEN: [],
    };
    const ids: string[] = [];

    for (const { fields, id } of unvalidatedRecords) {
      if (isRoomAssessmentQuestion(fields)) {
        if (!ids.includes(fields.id)) {
          questions[fields.roomType].push(fields);
        } else {
          console.error(
            `Record ${id}, and id ${fields.id} has a duplicate id with another record`
          );
        }
      } else {
        console.error(`Record ${id} has an invalid set of fields`, fields);
      }
    }

    return questions;
  }
}

function transformResultToViolationRows(
  submissionId: string,
  result: ApiHomeAssessmentResult
) {
  return result.rooms.map(
    (room): AirtableRoomViolationRow => {
      const flattenedViolationsForRoom: { [bylawId: string]: boolean } = {};
      for (const violation of room.violations) {
        flattenedViolationsForRoom[violation.id] = true;
      }
      return {
        id: uuidv4(),
        // @ts-expect-error TS throws error when trying to declare the type as an array of strings
        submissionId: [submissionId],
        roomId: room.id,
        ...flattenedViolationsForRoom,
      };
    }
  );
}

function transformInputToRoomRows(
  submissionId: string,
  input: ApiHomeAssessmentInputWithRoomIds
) {
  return input.rooms.map(
    (room): AirtableRoomRow => {
      const prefixedQuestionIds: {
        [prefixedQuestionId: string]: "YES" | "NO";
      } = {};
      for (const questionId of Object.keys(room.responses)) {
        prefixedQuestionIds[`q${questionId}`] =
          room.responses[questionId].answer;
      }

      return {
        // @ts-expect-error TS throws error when trying to declare the type as an array of strings
        submissionId: [submissionId],
        id: room.id,
        type: room.type,
        ...prefixedQuestionIds,
      };
    }
  );
}

function transformInputToSubmissionRow(
  id: string,
  input: ApiHomeAssessmentInput
): AirtableSubmissionRow {
  return {
    id,
    address: input.details.address,
    rentalType: input.details.rentalType,
    totalRent: parseFloat(input.details.totalRent),
    landlord: input.details.landlord,
    landlordOther: input.details.landlordOther,
  };
}
