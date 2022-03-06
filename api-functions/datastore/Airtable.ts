import Airtable from "airtable";

import {
  ApiHomeAssessmentInputWithRoomIds,
  ApiHomeAssessmentResult,
} from "../../interfaces/api-home-assessment";
import { ApiUserInfo } from "../../interfaces/api-user-info";
import { HomeDetails } from "../../interfaces/home-assessment";
import { UNKNOWN_ERROR } from "../../utils/apiErrors";
import { chunk } from "../../utils/chunkArray";
import { Datastore } from "./Datastore";

type AirtableSubmissionRow = {
  id: string;
  userProvidedAddress: string;
  formattedAddress: string;
  long: string;
  lat: string;
  unitNumber?: string;
  rentalType: string;
  totalRent: number;
  landlord: string;
  landlordOther?: string;
  numberOfBedrooms: number;
  waterInRent: string;
  hydroInRent: string;
  gasInRent: string;
  internetInRent: string;
  parkingInRent: string;
  otherInRent: string;
  otherValue?: string;
};

type AirtableRoomRow = {
  submissionId: string[];
  id: string;
  type: string;
};

type AirtableRoomResponsesRow = {
  submissionId: string[];
  roomId: string;
  questionId: string;
  answer: "YES" | "NO" | "UNSURE" | "NA";
  selectedMultiselect: string;
};

type AirtableRoomViolationRow = {
  submissionId: string[];
  bylawId: string;
  roomId: string;
  status: "violation" | "possible";
};

export class AirtableStore implements Datastore {
  private _base: ReturnType<typeof Airtable.base>;

  constructor(baseId: string) {
    this._base = Airtable.base(baseId);
  }

  async fetchHomeDetailsById(
    submissionId: string
  ): Promise<[HomeDetails | null, Error | null]> {
    try {
      const val = await this._base("raw_submissions")
        .select({
          maxRecords: 1,
          filterByFormula: `id = "${submissionId}"`,
        })
        .all();

      if (val.length > 0) {
        return [transformHomeDetailsAirtableRow(val[0].fields), null];
      }
      return [null, new Error("submission id does not exist")];
    } catch (error) {
      console.error(error);
      return [null, UNKNOWN_ERROR];
    }
  }

  async saveHomeDetails(
    submissionId: string,
    details: HomeDetails
  ): Promise<[boolean, Error | null]> {
    try {
      await this._base("raw_submissions").create(
        transformHomeDetailsToRow(submissionId, details)
      );
      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  async saveHomeAssessmentInput(
    input: ApiHomeAssessmentInputWithRoomIds
  ): Promise<[boolean, Error | null]> {
    try {
      // save room data
      const transfomredRoomRows = transformInputToRoomRows(
        input.submissionId,
        input
      ).map((row) => ({
        fields: row,
      }));
      await this._createRecordsInChunks("raw_rooms", transfomredRoomRows);

      // save room responses
      const transformedRoomResponses = transformInputToRoomResponses(
        input.submissionId,
        input
      ).map((row) => ({
        fields: row,
      }));

      await this._createRecordsInChunks(
        "raw_room_responses",
        transformedRoomResponses
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
      let hasViolation = false;
      for (const room of result.rooms) {
        if (room.violations.length > 0 || room.possibleViolations.length > 0) {
          hasViolation = true;
          break;
        }
      }

      if (hasViolation) {
        // save violations
        const transformedViolationRows = transformResultToViolationRows(
          submissionId,
          result
        ).map((row) => ({
          fields: row,
        }));

        await this._createRecordsInChunks(
          "submissions_room_violations",
          transformedViolationRows
        );
      }

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  async saveUserInfo(details: ApiUserInfo): Promise<[boolean, Error | null]> {
    try {
      await this._base("user_info").create(details);
      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  // Airtable can only save 10 requests at a time
  async _createRecordsInChunks<T>(baseName: string, arr: T[]) {
    const chunkedArr = chunk(arr, 10);

    for (const chunkedRow of chunkedArr) {
      await this._base(baseName).create(chunkedRow, {
        typecast: true,
      });
    }
  }
}

function transformResultToViolationRows(
  submissionId: string,
  result: ApiHomeAssessmentResult
): AirtableRoomViolationRow[] {
  const unflattenedViolations = result.rooms.map(
    (room): AirtableRoomViolationRow[] => {
      const violations = room.violations.map(
        (violation): AirtableRoomViolationRow => ({
          submissionId: [submissionId],
          roomId: room.id,
          bylawId: violation.id,
          status: "violation",
        })
      );

      const possibleViolations = room.possibleViolations.map(
        (violation): AirtableRoomViolationRow => ({
          submissionId: [submissionId],
          roomId: room.id,
          bylawId: violation.id,
          status: "possible",
        })
      );

      return [...violations, ...possibleViolations];
    }
  );

  const emptyArray = new Array<AirtableRoomViolationRow>();
  // flatten 2D array to 1D array
  return emptyArray.concat(...unflattenedViolations);
}

function transformInputToRoomRows(
  submissionId: string,
  input: ApiHomeAssessmentInputWithRoomIds
) {
  return input.rooms.map(
    (room): AirtableRoomRow => {
      return {
        submissionId: [submissionId],
        id: room.id,
        type: room.type,
      };
    }
  );
}

function transformHomeDetailsToRow(
  id: string,
  details: HomeDetails
): AirtableSubmissionRow {
  return {
    id,
    userProvidedAddress: details.address.userProvided,
    formattedAddress: details.address.formatted,
    long: details.address.long,
    lat: details.address.lat,
    unitNumber: details.unitNumber,
    rentalType: details.rentalType,
    totalRent: parseFloat(details.totalRent),
    landlord: details.landlord,
    landlordOther: details.landlordOther,
    numberOfBedrooms: details.numberOfBedrooms,
    waterInRent: details.waterInRent,
    hydroInRent: details.hydroInRent,
    gasInRent: details.gasInRent,
    internetInRent: details.internetInRent,
    parkingInRent: details.parkingInRent,
    otherInRent: details.otherInRent,
    otherValue: details.otherValue,
  };
}

function transformHomeDetailsAirtableRow(
  row: AirtableSubmissionRow
): HomeDetails {
  return {
    address: {
      userProvided: row.userProvidedAddress,
      formatted: row.formattedAddress,
      long: row.long,
      lat: row.lat,
    },
    numberOfBedrooms: row.numberOfBedrooms,
    unitNumber: row.unitNumber,
    rentalType: row.rentalType as HomeDetails["rentalType"],
    totalRent: `${row.totalRent}`,
    landlord: row.landlord,
    landlordOther: row.landlordOther,
    waterInRent: row.waterInRent,
    hydroInRent: row.hydroInRent,
    gasInRent: row.gasInRent,
    internetInRent: row.internetInRent,
    parkingInRent: row.parkingInRent,
    otherInRent: row.otherInRent,
    otherValue: row.otherValue,
  };
}

function transformInputToRoomResponses(
  submissionId: string,
  input: ApiHomeAssessmentInputWithRoomIds
): AirtableRoomResponsesRow[] {
  const responsesUnflattened = input.rooms.map((room) =>
    Object.entries(room.responses).map(([questionId, response]) => ({
      submissionId: [submissionId],
      roomId: room.id,
      questionId,
      answer: response.answer,
      selectedMultiselect: response.selectedMultiselect ?? "",
    }))
  );

  // flatten the array from 2D array to 1d
  const emptyArray = new Array<AirtableRoomResponsesRow>();
  return emptyArray.concat(...responsesUnflattened);
}
