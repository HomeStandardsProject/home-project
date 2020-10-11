import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Heading, Stack } from "@chakra-ui/core";
import { RoomsSideBar } from "./RoomsSideBar";
import {
  HomeAssessmentData,
  HomeDetails as HomeDetailsType,
  Room,
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../interfaces/home-assessment";
import { sortRoomsBasedOnTypeAndName } from "./helpers/sortRoomsBasedOnTypeAndName";
import { normalizeRoomNames } from "./helpers/normalizeRooms";
import { RoomAssessment } from "./RoomAssessment";
import { HomeDetailsForm } from "./HomeDetailsForm";
import { HomeDetailsSummary } from "./HomeDetailsSummary";
import { deleteRoomAction } from "./actions/deleteRoomAction";
import {
  updateRoomType,
  updateRoomName,
  updateRoomQuestionAnswer,
} from "./actions/updateRoomActions";

type Props = {
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

export const HomeAssessment: React.FC<Props> = ({ questions }) => {
  const generateDefaultRoom = React.useCallback(
    (): Room => ({ id: uuidv4(), type: "LIVING", questions: questions.LIVING }),
    [questions]
  );

  const [
    { rooms, selectedRoomId, details, step },
    setAssessment,
  ] = React.useState<HomeAssessmentData>(() => {
    const initialRoom = generateDefaultRoom();
    return {
      step: "DETAILS",
      selectedRoomId: initialRoom.id,
      rooms: [initialRoom],
      details: {},
    };
  });

  const normalizeAndSortRooms = React.useMemo(() => {
    const sortedRooms = sortRoomsBasedOnTypeAndName(rooms);
    return normalizeRoomNames(sortedRooms);
  }, [rooms]);

  const handleAddNewRoom = React.useCallback(() => {
    setAssessment((assessment) => ({
      ...assessment,
      rooms: [...assessment.rooms, generateDefaultRoom()],
    }));
  }, [generateDefaultRoom]);

  const handleUpdateRoomName = React.useCallback(
    (newName: string | undefined) => {
      setAssessment((assessment) =>
        updateRoomName(assessment, selectedRoomId, newName)
      );
    },
    [selectedRoomId]
  );

  const handleUpdateRoomType = React.useCallback(
    (type: RoomTypes) => {
      setAssessment((assessment) =>
        updateRoomType(assessment, selectedRoomId, type, questions[type])
      );
    },
    [selectedRoomId, questions]
  );

  const handleUpdateRoomQuestion = React.useCallback(
    (
      questionId: string,
      answer: "YES" | "NO" | undefined,
      description: string | undefined
    ) => {
      setAssessment((assessment) =>
        updateRoomQuestionAnswer(
          assessment,
          selectedRoomId,
          questionId,
          answer,
          description
        )
      );
    },
    [selectedRoomId]
  );

  const updateSelectedRoom = React.useCallback((id: string) => {
    setAssessment((assessment) => ({ ...assessment, selectedRoomId: id }));
  }, []);

  const handleDeleteRoom = React.useCallback(
    (idToDelete: string) =>
      setAssessment((assessment) => deleteRoomAction(assessment, idToDelete)),
    []
  );

  const handleDetailsChanged = React.useCallback(
    (
      updatedDetails: (
        oldDetails: Partial<HomeDetailsType>
      ) => Partial<HomeDetailsType>
    ) => {
      setAssessment((assessment) => ({
        ...assessment,
        details: updatedDetails(assessment.details),
      }));
    },
    []
  );

  const handleFormHasBeenCompleted = React.useCallback(() => {
    setAssessment((assessment) => ({ ...assessment, step: "ASSESSMENT" }));
  }, []);

  const handleDetailsSummarySwitchToDetails = React.useCallback(() => {
    setAssessment((assessment) => ({ ...assessment, step: "DETAILS" }));
  }, []);

  const selectedRoom: Room = React.useMemo(() => {
    const matchingRoom = rooms.find((room) => room.id === selectedRoomId);
    if (matchingRoom) return matchingRoom;
    throw new Error("selected room id is not valid");
  }, [rooms, selectedRoomId]);

  const detailsStepContent = (
    <Box>
      <HomeDetailsForm
        details={details}
        detailsChanged={handleDetailsChanged}
        formHasBeenCompleted={handleFormHasBeenCompleted}
      />
    </Box>
  );

  console.log(selectedRoom);

  const assessmentStepContent = (
    <Box>
      <HomeDetailsSummary
        details={details}
        switchToDetails={handleDetailsSummarySwitchToDetails}
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
      <Stack isInline spacing={4}>
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
          <RoomAssessment
            key={selectedRoomId}
            room={selectedRoom}
            updateRoomName={handleUpdateRoomName}
            updateRoomType={handleUpdateRoomType}
            updateQuestion={handleUpdateRoomQuestion}
          />
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Stack width="100%" marginTop="16pt" marginBottom="48pt">
      {step === "DETAILS" ? detailsStepContent : assessmentStepContent}
    </Stack>
  );
};
