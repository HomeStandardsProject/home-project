import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Flex } from "@chakra-ui/core";
import { RoomsSideBar } from "./RoomsSideBar";
import { HomeAssessmentData, Room } from "../../interfaces/home-assessment";
import { sortRoomsBasedOnTypeAndName } from "../../utils/helpers/sortRoomsBasedOnTypeAndName";
import { normalizeRoomNames } from "../../utils/helpers/normalizeRooms";

const generateRoom = (): Room => ({ id: uuidv4(), type: "LIVING" });

export const HomeAssessment: React.FC = () => {
  const [assessment, setAssessment] = React.useState<HomeAssessmentData>({
    rooms: [generateRoom()],
  });

  const normalizeAndSortRooms = React.useMemo(() => {
    const sortedRooms = sortRoomsBasedOnTypeAndName(assessment.rooms);
    return normalizeRoomNames(sortedRooms);
  }, [assessment.rooms]);

  const handleAddNewRoom = React.useCallback(() => {
    setAssessment((assessment) => ({
      ...assessment,
      rooms: [...assessment.rooms, generateRoom()],
    }));
  }, []);

  return (
    <Flex width="100%">
      <Box minW="300px">
        <RoomsSideBar
          rooms={normalizeAndSortRooms}
          addRoom={handleAddNewRoom}
          changedSelectedRoom={() => {}}
        />
      </Box>
      <Box flexBasis={"100%"}>
        <Box padding="4pt">Content</Box>
      </Box>
    </Flex>
  );
};
