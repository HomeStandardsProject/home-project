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

export type HomeAssessmentData = {
  selectedRoomId: string;
  rooms: Room[];
};
