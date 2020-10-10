export type Room = {
  id: string;
  name?: string;
  type: "WASH" | "BED" | "LIVING";
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
  rooms: Room[];
};
