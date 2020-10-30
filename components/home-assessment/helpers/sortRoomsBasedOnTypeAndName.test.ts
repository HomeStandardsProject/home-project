import { Room } from "../../../interfaces/home-assessment";
import { sortRoomsBasedOnTypeAndName } from "./sortRoomsBasedOnTypeAndName";

const DEFAULT_ROOM: Room = { id: "0", type: "KITCHEN", responses: {} };

describe("sortRoomsBasedOnTypeAndName", () => {
  it("sorts by type", () => {
    const rooms: Room[] = [
      { ...DEFAULT_ROOM, id: "4", type: "WASH" },
      { ...DEFAULT_ROOM, id: "2", type: "KITCHEN" },
      { ...DEFAULT_ROOM, id: "1", type: "BED" },
      { ...DEFAULT_ROOM, id: "3", type: "KITCHEN" },
    ];

    expect(sortRoomsBasedOnTypeAndName(rooms)).toEqual([
      { ...DEFAULT_ROOM, id: "1", type: "BED" },
      { ...DEFAULT_ROOM, id: "2", type: "KITCHEN" },
      { ...DEFAULT_ROOM, id: "3", type: "KITCHEN" },
      { ...DEFAULT_ROOM, id: "4", type: "WASH" },
    ]);
  });

  it("sorts by type and name", () => {
    const rooms: Room[] = [
      { ...DEFAULT_ROOM, id: "4", type: "WASH" },
      {
        ...DEFAULT_ROOM,
        id: "3",
        type: "KITCHEN",
        name: "Upstairs Common Room",
      },
      { ...DEFAULT_ROOM, id: "1", type: "BED" },
      { ...DEFAULT_ROOM, id: "2", type: "KITCHEN" },
    ];
    expect(sortRoomsBasedOnTypeAndName(rooms)).toEqual([
      { ...DEFAULT_ROOM, id: "1", type: "BED" },
      { ...DEFAULT_ROOM, id: "2", type: "KITCHEN" },
      {
        ...DEFAULT_ROOM,
        id: "3",
        type: "KITCHEN",
        name: "Upstairs Common Room",
      },
      { ...DEFAULT_ROOM, id: "4", type: "WASH" },
    ]);
  });

  it("sorts by type and name giving precedent to null names", () => {
    const rooms: Room[] = [
      { ...DEFAULT_ROOM, id: "2", type: "BED", name: "Jim's Room" },
      { ...DEFAULT_ROOM, id: "5", type: "WASH" },
      {
        ...DEFAULT_ROOM,
        id: "4",
        type: "KITCHEN",
        name: "Upstairs Common Room",
      },
      { ...DEFAULT_ROOM, id: "1", type: "BED" },
      { ...DEFAULT_ROOM, id: "3", type: "KITCHEN" },
      { ...DEFAULT_ROOM, id: "6", type: "WASH" },
    ];
    expect(sortRoomsBasedOnTypeAndName(rooms)).toEqual([
      { ...DEFAULT_ROOM, id: "1", type: "BED" },
      { ...DEFAULT_ROOM, id: "2", type: "BED", name: "Jim's Room" },
      { ...DEFAULT_ROOM, id: "3", type: "KITCHEN" },
      {
        ...DEFAULT_ROOM,
        id: "4",
        type: "KITCHEN",
        name: "Upstairs Common Room",
      },
      { ...DEFAULT_ROOM, id: "5", type: "WASH" },
      { ...DEFAULT_ROOM, id: "6", type: "WASH" },
    ]);
  });
});
