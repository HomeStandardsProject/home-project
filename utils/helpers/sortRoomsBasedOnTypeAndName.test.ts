import { Room } from "../../interfaces/home-assessment";
import { sortRoomsBasedOnTypeAndName } from "./sortRoomsBasedOnTypeAndName";

describe("sortRoomsBasedOnTypeAndName", () => {
  it("sorts by type", () => {
    const rooms: Room[] = [
      { id: "4", type: "WASH" },
      { id: "2", type: "LIVING" },
      { id: "1", type: "BED" },
      { id: "3", type: "LIVING" },
    ];

    expect(sortRoomsBasedOnTypeAndName(rooms)).toEqual([
      { id: "1", type: "BED" },
      { id: "2", type: "LIVING" },
      { id: "3", type: "LIVING" },
      { id: "4", type: "WASH" },
    ]);
  });

  it("sorts by type and name", () => {
    const rooms: Room[] = [
      { id: "4", type: "WASH" },
      { id: "3", type: "LIVING", name: "Upstairs Common Room" },
      { id: "1", type: "BED" },
      { id: "2", type: "LIVING" },
    ];
    expect(sortRoomsBasedOnTypeAndName(rooms)).toEqual([
      { id: "1", type: "BED" },
      { id: "2", type: "LIVING" },
      { id: "3", type: "LIVING", name: "Upstairs Common Room" },
      { id: "4", type: "WASH" },
    ]);
  });

  it("sorts by type and name giving precedent to null names", () => {
    const rooms: Room[] = [
      { id: "2", type: "BED", name: "Jim's Room" },
      { id: "5", type: "WASH" },
      { id: "4", type: "LIVING", name: "Upstairs Common Room" },
      { id: "1", type: "BED" },
      { id: "3", type: "LIVING" },
      { id: "6", type: "WASH" },
    ];
    expect(sortRoomsBasedOnTypeAndName(rooms)).toEqual([
      { id: "1", type: "BED" },
      { id: "2", type: "BED", name: "Jim's Room" },
      { id: "3", type: "LIVING" },
      { id: "4", type: "LIVING", name: "Upstairs Common Room" },
      { id: "5", type: "WASH" },
      { id: "6", type: "WASH" },
    ]);
  });
});
