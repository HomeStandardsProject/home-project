import { Room } from "../../interfaces/home-assessment";

export function sortRoomsBasedOnTypeAndName(rooms: Room[]) {
  return [...rooms].sort((A, B) => {
    if (A.type > B.type) {
      return 1;
    }
    if (A.type < B.type) {
      return -1;
    }

    // A and B have the same type
    const definedRoomAName = A.name ? A.name : "";
    const definedRoomBName = B.name ? B.name : "";
    if (definedRoomAName > definedRoomBName) {
      return 1;
    }
    if (definedRoomAName < definedRoomBName) {
      return -1;
    }
    return 0;
  });
}
