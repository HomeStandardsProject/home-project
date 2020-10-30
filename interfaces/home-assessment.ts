export type RoomAssessmentQuestion = {
  id: string;
  roomType: RoomTypes;
  question: string;
  type: "YES/NO";
  promptForDescriptionOn: "YES" | "NO";
};

export function isRoomAssessmentQuestion(data: {
  [key: string]: unknown;
}): data is RoomAssessmentQuestion {
  if (
    "id" in data &&
    "question" in data &&
    "type" in data &&
    "promptForDescriptionOn" in data &&
    "roomType" in data
  ) {
    if (
      data.promptForDescriptionOn === "YES" ||
      data.promptForDescriptionOn === "NO"
    ) {
      if (data.type === "YES/NO") {
        if (ROOM_TYPES.includes(data.roomType as RoomTypes)) {
          return true;
        }
      }
    }
  }
  return false;
}

export type AllRoomAssessmentQuestion = {
  [type in RoomTypes]: RoomAssessmentQuestion[];
};

export type RoomAssessmentQuestionResponse = {
  answer?: ("YES" | "NO") | undefined;
  description?: string;
};

export const ROOM_TYPES = ["WASH", "BED", "KITCHEN"] as const;
export type RoomTypes = typeof ROOM_TYPES[number];
export type Room = {
  id: string;
  name?: string;
  type: RoomTypes;
  responses: { [id: string]: RoomAssessmentQuestionResponse };
};

export function transformRoomTypeToLabel(type: Room["type"]) {
  switch (type) {
    case "BED":
      return "Bedroom";
    case "KITCHEN":
      return "Kitchen";
    case "WASH":
      return "Washroom";
    default:
      throw new Error("unknown room type");
  }
}

export const LANDLORDS = [
  "Highpoint Properties",
  "Frontenac Property Management",
  "Other",
] as const;
export type Landlords = typeof LANDLORDS[number];

export const RENTAL_TYPES = ["Full-house", "Rental Unit", "Condo"] as const;
export type RentalType = typeof RENTAL_TYPES[number];
export type HomeDetails = {
  address: string;
  rentalType: RentalType;
  totalRent: string;
  landlord: Landlords;
  landlordOther?: string;
};

export type HomeAssessmentData = {
  step: "DETAILS" | "ASSESSMENT";
  selectedRoomId: string;
  rooms: Room[];
  details: Partial<HomeDetails>;
};
