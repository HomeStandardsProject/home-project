export type RoomType = "YES/NO" | "MULTISELECT";
export type RoomAssessmentQuestion = {
  id: string;
  order: number | null;
  type: RoomType;
  question: string;
  promptForDescriptionOn: "YES" | "NO";
  multiselectValues?: string[];
};

export type AllRoomAssessmentQuestion = {
  [type in RoomTypes]: RoomAssessmentQuestion[];
};

export type RoomAssessmentQuestionResponse = {
  answer?: ("YES" | "NO" | "UNSURE") | undefined;
  selectedMultiselect?: string[];
  description?: string;
};

export const ROOM_TYPES = [
  "WASH",
  "BED",
  "LIVING",
  "KITCHEN",
  "ENTRANCE",
  "EXTERIOR",
  "HEATING",
  "PESTS",
] as const;
export const GENERAL_ROOM_TYPES = [
  "PESTS",
  "ENTRANCE",
  "HEATING",
  "EXTERIOR",
] as const;
export type RoomTypes = typeof ROOM_TYPES[number];
export type Room = {
  id: string;
  name?: string;
  type: RoomTypes;
  responses: { [id: string]: RoomAssessmentQuestionResponse };
};

type GeneralRoomType = typeof GENERAL_ROOM_TYPES[number];
export function isGeneralRoomType(type: RoomTypes): type is GeneralRoomType {
  for (const generalType of GENERAL_ROOM_TYPES) {
    if (generalType === type) return true;
  }
  return false;
}

export const NON_GENERAL_ROOM_TYPES = ROOM_TYPES.filter(
  (type) => !isGeneralRoomType(type)
);

export function transformRoomTypeToLabel(type: Room["type"]) {
  switch (type) {
    case "BED":
      return "Bedroom";
    case "LIVING":
      return "Living Room";
    case "WASH":
      return "Washroom";
    case "KITCHEN":
      return "Kitchen";
    case "ENTRANCE":
      return "Entrance";
    case "EXTERIOR":
      return "Exterior";
    case "HEATING":
      return "Heating";
    case "PESTS":
      return "Pests";
    default:
      throw new Error("unknown room type");
  }
}

export function placeholderBasedOnType(type: Room["type"]) {
  const label: { [key in Room["type"]]: string } = {
    BED: "Finley's Room",
    LIVING: "Upstairs Living Room",
    WASH: "Main Washroom",
    KITCHEN: "Kitchen",
    ENTRANCE: "Main Entrance",
    EXTERIOR: "Exterior",
    HEATING: "Heating",
    PESTS: "Pests",
  };

  return label[type];
}

export const RENTAL_TYPES = [
  "Full house",
  "Divided house (multiple units)",
  "Apartment",
  "Apartment building/complex",
] as const;
export type RentalType = typeof RENTAL_TYPES[number];
export type HomeDetails = {
  city: string;
  address: {
    userProvided: string;
    formatted: string;
    long: string;
    lat: string;
  };
  unitNumber?: string;
  rentalType: RentalType;
  totalRent: string;
  landlord: string;
  landlordOther?: string;
  numberOfBedrooms: number;
};

export type HomeAssessmentData = {
  selectedRoomId: string;
  rooms: Room[];
};

export type HomeEvaluationData = {
  selectedRoomId: string;
  rooms: Room[];
  step: "general" | "rooms";
};
