-- CreateEnum
CREATE TYPE "QuestionAnswer" AS ENUM ('YES', 'NO', 'UNSURE');

-- CreateEnum
CREATE TYPE "ViolationStatus" AS ENUM ('violation', 'unsure');

-- CreateTable
CREATE TABLE "RawRoom" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rawSubmissionId" TEXT NOT NULL,

    CONSTRAINT "RawRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawRoomResponses" (
    "id" SERIAL NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" "QuestionAnswer" NOT NULL,
    "selectedMultiselect" TEXT,
    "rawRoomId" TEXT NOT NULL,

    CONSTRAINT "RawRoomResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawSubmission" (
    "id" TEXT NOT NULL,
    "userProvidedAddress" TEXT NOT NULL,
    "formattedAddress" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "unitNumber" TEXT,
    "rentalType" TEXT NOT NULL,
    "numberOfBedrooms" INTEGER NOT NULL,
    "totalRent" DOUBLE PRECISION NOT NULL,
    "landlord" TEXT NOT NULL,
    "landlordOther" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionRoomViolations" (
    "id" SERIAL NOT NULL,
    "bylawId" TEXT NOT NULL,
    "status" "ViolationStatus" NOT NULL,
    "generatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawSubmissionId" TEXT,
    "rawRoomId" TEXT NOT NULL,

    CONSTRAINT "SubmissionRoomViolations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "subscribeToNewsletter" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RawRoom" ADD CONSTRAINT "RawRoom_rawSubmissionId_fkey" FOREIGN KEY ("rawSubmissionId") REFERENCES "RawSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawRoomResponses" ADD CONSTRAINT "RawRoomResponses_rawRoomId_fkey" FOREIGN KEY ("rawRoomId") REFERENCES "RawRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionRoomViolations" ADD CONSTRAINT "SubmissionRoomViolations_rawRoomId_fkey" FOREIGN KEY ("rawRoomId") REFERENCES "RawRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionRoomViolations" ADD CONSTRAINT "SubmissionRoomViolations_rawSubmissionId_fkey" FOREIGN KEY ("rawSubmissionId") REFERENCES "RawSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
