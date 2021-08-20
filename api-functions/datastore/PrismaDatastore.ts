import { PrismaClient, PrismaPromise } from "@prisma/client";
import {
  ApiHomeAssessmentInputWithRoomIds,
  ApiHomeAssessmentResult,
} from "../../interfaces/api-home-assessment";
import { ApiUserInfo } from "../../interfaces/api-user-info";
import { HomeDetails, RentalType } from "../../interfaces/home-assessment";
import { UNKNOWN_ERROR } from "../../utils/apiErrors";
import { Datastore } from "./Datastore";

export class PrismaDatastore implements Datastore {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async saveHomeAssessmentInput(
    input: ApiHomeAssessmentInputWithRoomIds
  ): Promise<[boolean, Error | null]> {
    try {
      const ops: PrismaPromise<any>[] = [];

      for (const room of input.rooms) {
        const op = this.client.rawRoom.create({
          data: {
            id: room.id,
            rawSubmissionId: input.submissionId,
            type: room.type,
            responses: {
              createMany: {
                data: Object.entries(room.responses).map(
                  ([questionId, response]) => ({
                    questionId,
                    answer: response.answer,
                    selectedMultiselect: response.selectedMultiselect,
                  })
                ),
              },
            },
          },
        });
        ops.push(op);
      }

      await this.client.$transaction(ops);

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  async saveHomeDetails(
    submissionId: string,
    details: HomeDetails
  ): Promise<[boolean, Error | null]> {
    try {
      await this.client.rawSubmission.create({
        data: {
          id: submissionId,
          userProvidedAddress: details.address.userProvided,
          formattedAddress: details.address.formatted,
          unitNumber: details.unitNumber,
          lat: details.address.lat,
          long: details.address.long,
          numberOfBedrooms: details.numberOfBedrooms,
          rentalType: details.rentalType,
          totalRent: Number(details.totalRent),
          landlord: details.landlord,
          landlordOther: details.landlordOther,
        },
      });

      return [true, null];
    } catch (error) {
      console.error(error);
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
        await this.client.submissionRoomViolations.createMany({
          data: transformResultToViolationRows(submissionId, result),
        });
      }

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  async saveUserInfo(details: ApiUserInfo): Promise<[boolean, Error | null]> {
    try {
      await this.client.user.create({ data: details });
      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  async fetchHomeDetailsById(
    submissionId: string
  ): Promise<[HomeDetails | null, Error | null]> {
    try {
      const result = await this.client.rawSubmission.findUnique({
        where: {
          id: submissionId,
        },
      });

      if (!result) {
        return [null, new Error("submission id does not exist")];
      }

      return [
        {
          address: {
            formatted: result.formattedAddress,
            lat: result.lat,
            long: result.long,
            userProvided: result.userProvidedAddress,
          },
          landlord: result.landlord,
          landlordOther: result.landlordOther ?? undefined,
          numberOfBedrooms: result.numberOfBedrooms,
          unitNumber: result.unitNumber ?? undefined,
          rentalType: result.rentalType as RentalType,
          totalRent: String(result.totalRent),
        },
        null,
      ];
    } catch (error) {
      console.error(error);
      return [null, UNKNOWN_ERROR];
    }
  }
}

// ideally we could just use the codegenerated types from prisma here
// but it looks like the nextjs bundler struggles at finding the types
// for some reason
type PrismaViolation = {
  rawSubmissionId: string;
  rawRoomId: string;
  bylawId: string;
  status: "violation" | "unsure";
};

function transformResultToViolationRows(
  submissionId: string,
  result: ApiHomeAssessmentResult
): PrismaViolation[] {
  const unflattenedViolations = result.rooms.map((room): PrismaViolation[] => {
    const violations = room.violations.map(
      (violation): PrismaViolation => ({
        rawSubmissionId: submissionId,
        rawRoomId: room.id,
        bylawId: violation.id,
        status: "violation",
      })
    );

    const possibleViolations = room.possibleViolations.map(
      (violation): PrismaViolation => ({
        rawSubmissionId: submissionId,
        rawRoomId: room.id,
        bylawId: violation.id,
        status: "unsure",
      })
    );

    return [...violations, ...possibleViolations];
  });

  const emptyArray = new Array<PrismaViolation>();
  // flatten 2D array to 1D array
  return emptyArray.concat(...unflattenedViolations);
}
