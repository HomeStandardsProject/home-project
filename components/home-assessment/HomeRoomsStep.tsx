import * as React from "react";
import { Box, Heading, Stack, useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { HomeDetailsSummary } from "./HomeDetailsSummary";
import { HomeDetails, Room, RoomTypes } from "../../interfaces/home-assessment";
import { useAssessmentCalculatorApi } from "./hooks/useAssessmentCalculatorApi";
import { NormalizedRoom } from "./helpers/normalizeRooms";
import { RoomAssessment } from "./RoomAssessment";
import { RoomsSideBar } from "./RoomsSideBar";
import { useLayoutType } from "./hooks/useLayoutType";

type Props = {
  details: Partial<HomeDetails>;
  rooms: NormalizedRoom[];
  selectedRoomId: string;
  addNewRoom: () => void;
  updateRoomName: (name: string | undefined) => void;
  updateRoomType: (type: RoomTypes) => void;
  updateRoomQuestion: (
    questionId: string,
    answer: "YES" | "NO" | "UNSURE" | undefined,
    description: string | undefined
  ) => void;
  updateSelectedRoom: (id: string) => void;
  deleteRoom: (idToDelete: string) => void;
  switchToDetailStep: () => void;
};

export const HomeRoomsStep: React.FC<Props> = ({
  details,
  rooms,
  selectedRoomId,
  addNewRoom,
  updateRoomName,
  updateRoomType,
  updateRoomQuestion,
  updateSelectedRoom,
  deleteRoom,
  switchToDetailStep,
}) => {
  const {
    generatingAssessment,
    generateAssessment,
  } = useAssessmentCalculatorApi();
  const router = useRouter();
  const toast = useToast();
  const layoutType = useLayoutType();

  const handleGenerateReport = React.useCallback(async () => {
    const { successful, errors } = await generateAssessment(rooms, details);

    if (successful) {
      router.push("/results");
    } else {
      errors.map((error) => toast({ description: error.msg, status: "error" }));
    }
  }, [router, toast, generateAssessment, rooms, details]);

  const selectedRoom: Room = React.useMemo(() => {
    const matchingRoom = rooms.find((room) => room.id === selectedRoomId);
    if (matchingRoom) return matchingRoom;
    throw new Error("selected room id is not valid");
  }, [rooms, selectedRoomId]);

  const isInline = layoutType === "desktop";

  return (
    <Box>
      <HomeDetailsSummary
        details={details}
        switchToDetails={switchToDetailStep}
      />
      <br />
      <Heading
        as="h3"
        size="xs"
        textTransform="uppercase"
        marginBottom="8pt"
        padding="4pt"
      >
        Assessment
      </Heading>
      <Stack isInline={isInline} spacing={4}>
        <Box minW="300px">
          <RoomsSideBar
            generatingAssessment={generatingAssessment}
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            addRoom={addNewRoom}
            deleteRoom={deleteRoom}
            changedSelectedRoom={updateSelectedRoom}
            generateReport={handleGenerateReport}
          />
        </Box>
        <Box flexBasis={"100%"}>
          <RoomAssessment
            key={selectedRoomId}
            room={selectedRoom}
            updateRoomName={updateRoomName}
            updateRoomType={updateRoomType}
            updateQuestion={updateRoomQuestion}
          />
        </Box>
      </Stack>
    </Box>
  );
};
