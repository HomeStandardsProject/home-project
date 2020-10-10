import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Flex } from "@chakra-ui/core";
import { RoomsSideBar } from "./RoomsSideBar";
import { HomeAssessmentData, Room } from "../../interfaces/home-assessment";
import { sortRoomsBasedOnTypeAndName } from "../../utils/helpers/sortRoomsBasedOnTypeAndName";
import { normalizeRoomNames } from "../../utils/helpers/normalizeRooms";
import { RoomAssessment } from "./RoomAssessment";

const generateRoom = (): Room => ({ id: uuidv4(), type: "LIVING" });

export const HomeAssessment: React.FC = () => {
  const [{ rooms, selectedRoomId }, setAssessment] = React.useState<
    HomeAssessmentData
  >(() => {
    const initialRoom = generateRoom();
    return {
      selectedRoomId: initialRoom.id,
      rooms: [initialRoom],
    };
  });

  const normalizeAndSortRooms = React.useMemo(() => {
    const sortedRooms = sortRoomsBasedOnTypeAndName(rooms);
    return normalizeRoomNames(sortedRooms);
  }, [rooms]);

  const handleAddNewRoom = React.useCallback(() => {
    setAssessment((assessment) => ({
      ...assessment,
      rooms: [...assessment.rooms, generateRoom()],
    }));
  }, []);

  const updateRoomChanged = React.useCallback((newRoom: Room) => {
    setAssessment((assessment) => {
      const newRooms = assessment.rooms.map((room) =>
        room.id === newRoom.id ? newRoom : room
      );

      return {
        ...assessment,
        rooms: newRooms,
      };
    });
  }, []);

  const updateSelectedRoom = React.useCallback((id: string) => {
    setAssessment((assessment) => {
      return {
        ...assessment,
        selectedRoomId: id,
      };
    });
  }, []);

  const handleDeleteRoom = React.useCallback((idToDelete: string) => {
    setAssessment((assessment) => {
      if (assessment.rooms.length <= 1) {
        console.error("invalid state. unable to delete only remaining room");
        return assessment;
      }

      const newRooms = assessment.rooms.filter(
        (room) => room.id !== idToDelete
      );

      const newSelectedRoomId =
        assessment.selectedRoomId === idToDelete
          ? newRooms[0].id
          : assessment.selectedRoomId;

      return {
        ...assessment,
        selectedRoomId: newSelectedRoomId,
        rooms: newRooms,
      };
    });
  }, []);

  const selectedRoom: Room = React.useMemo(() => {
    const matchingRoom = rooms.find((room) => room.id === selectedRoomId);
    if (matchingRoom) return matchingRoom;
    throw new Error("selected room id is not valid");
  }, [rooms, selectedRoomId]);

  return (
    <Flex width="100%" marginTop="16pt" marginBottom="16pt">
      <Box minW="300px">
        <RoomsSideBar
          rooms={normalizeAndSortRooms}
          selectedRoomId={selectedRoomId}
          addRoom={handleAddNewRoom}
          deleteRoom={handleDeleteRoom}
          changedSelectedRoom={updateSelectedRoom}
        />
      </Box>
      <Box flexBasis={"100%"}>
        <RoomAssessment room={selectedRoom} dataChanged={updateRoomChanged} />
      </Box>
    </Flex>
  );
};
