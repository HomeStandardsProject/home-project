export const ROOM_TYPES = ["WASH", "BED", "LIVING"] as const;
export type Room = {
  id: string;
  name?: string;
  type: typeof ROOM_TYPES[number];
};

export function transformRoomTypeToLabel(type: Room["type"]) {
  switch (type) {
    case "BED":
      return "Bedroom";
    case "LIVING":
      return "Living Room";
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
  selectedRoomId: string;
  rooms: Room[];
  details: Partial<HomeDetails>;
};
