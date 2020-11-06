import {
  Room,
  transformRoomTypeToLabel,
} from "../../../interfaces/home-assessment";

export type NormalizedRoom = Exclude<Room, "name"> & { name: string };

export function normalizeRoomNames(sortedRooms: Room[]): NormalizedRoom[] {
  const normalizedRooms: NormalizedRoom[] = [];
  let rollingRoom: { count: number; type: Room["type"] } | null = null;

  for (const room of sortedRooms) {
    if (room.name === undefined) {
      if (rollingRoom && rollingRoom.type === room.type) {
        // an active rolling room count
        // same type, thus increment count and set name
        const newRoomCount: number = rollingRoom.count + 1;
        normalizedRooms.push({
          ...room,
          name: `${transformRoomTypeToLabel(room.type)} ${newRoomCount}`,
        });
        rollingRoom = { count: newRoomCount, type: room.type };
      } else {
        // different type of room or no room rolling, start new count
        normalizedRooms.push({
          ...room,
          name: `${transformRoomTypeToLabel(room.type)} 1`,
        });
        rollingRoom = { count: 1, type: room.type };
      }
    } else {
      normalizedRooms.push({ ...room, name: room.name });
    }
  }

  return normalizedRooms;
}
