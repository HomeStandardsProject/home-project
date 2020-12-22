export type RoomAssessmentQuestion = {
  id: string;
  question: string;
  promptForDescriptionOn: "YES" | "NO";
};

export type AllRoomAssessmentQuestion = {
  [type in RoomTypes]: RoomAssessmentQuestion[];
};

export type RoomAssessmentQuestionResponse = {
  answer?: ("YES" | "NO" | "UNSURE") | undefined;
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
] as const;
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
    case "LIVING":
      return "Living Room";
    case "WASH":
      return "Washroom";
    case "KITCHEN":
      return "Kitchen";
    case "ENTRANCE":
      return "Entrance";
    case "EXTERIOR":
      return "Exteriror";
    case "HEATING":
      return "Heating";
    default:
      throw new Error("unknown room type");
  }
}

const SORTED_LANDLORDS = [
  "Frontenac Property Management",
  "Highpoint Properties",
  "Keystone Property Management",
  "Limestone Property Management",
  "MacKinnon Development Corporation",
  "Morris Property Management",
  "Panadew Property Management",
  "Queen’s Community Housing",
  "Varsity Communities",
].sort();

export const LANDLORDS = [...SORTED_LANDLORDS, "Other"] as const;
export type Landlords = typeof LANDLORDS[number];

export const RENTAL_TYPES = [
  "Full house",
  "Divided house (multiple units)",
  "Apartment",
  "Apartment building/complex",
] as const;
export type RentalType = typeof RENTAL_TYPES[number];
export type HomeDetails = {
  address: {
    userProvided: string;
    formatted: string;
    long: string;
    lat: string;
  };
  unitNumber?: string;
  rentalType: RentalType;
  totalRent: string;
  landlord: Landlords;
  landlordOther?: string;
};

export type HomeAssessmentData = {
  selectedRoomId: string;
  rooms: Room[];
};
