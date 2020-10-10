export type Room = {
  id: string;
  name?: string;
  type: "WASH" | "BED" | "LIVING";
};

export type HomeAssessmentData = {
  rooms: Room[];
};
