import * as React from "react";
import { Box, Flex } from "@chakra-ui/core";
import { RoomsSideBar } from "./RoomsSideBar";
import { HomeAssessmentData } from "../../interfaces/home-assessment";

export const HomeAssessment: React.FC = () => {
  const [assessment, setAssessment] = React.useState<HomeAssessmentData>({
    rooms: [{ id: "1", type: "LIVING" }],
  });

  const normalizeAndSortRooms = React.useMemo(() => {
    return assessment.rooms.map((room, i) => ({ ...room, name: `Room ${i}` }));
  }, [assessment.rooms]);

  return (
    <Flex width="100%">
      <Box minW="300px">
        <RoomsSideBar
          rooms={normalizeAndSortRooms}
          addRoom={() => {}}
          changedSelectedRoom={() => {}}
        />
      </Box>
      <Box flexBasis={"100%"}>
        <Box padding="4pt">Content</Box>
      </Box>
    </Flex>
  );
};
