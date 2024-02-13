-- DropForeignKey
ALTER TABLE "RawRoom" DROP CONSTRAINT "RawRoom_rawSubmissionId_fkey";

-- DropForeignKey
ALTER TABLE "RawRoomResponses" DROP CONSTRAINT "RawRoomResponses_rawRoomId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionRoomViolations" DROP CONSTRAINT "SubmissionRoomViolations_rawRoomId_fkey";

-- AddForeignKey
ALTER TABLE "RawRoom" ADD CONSTRAINT "RawRoom_rawSubmissionId_fkey" FOREIGN KEY ("rawSubmissionId") REFERENCES "RawSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawRoomResponses" ADD CONSTRAINT "RawRoomResponses_rawRoomId_fkey" FOREIGN KEY ("rawRoomId") REFERENCES "RawRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionRoomViolations" ADD CONSTRAINT "SubmissionRoomViolations_rawRoomId_fkey" FOREIGN KEY ("rawRoomId") REFERENCES "RawRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
