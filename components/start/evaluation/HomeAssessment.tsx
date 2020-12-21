import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box } from "@chakra-ui/react";

import {
  HomeAssessmentData,
  HomeDetails,
  Room,
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../../interfaces/home-assessment";
import { sortRoomsBasedOnTypeAndName } from "./helpers/sortRoomsBasedOnTypeAndName";
import { normalizeRoomNames } from "./helpers/normalizeRooms";

import { deleteRoomAction } from "./actions/deleteRoomAction";
import {
  updateRoomType,
  updateRoomName,
  updateRoomQuestionAnswer,
} from "./actions/updateRoomActions";
import { RoomAssessmentQuestionsContext } from "./hooks/useRoomAssessmentQuestions";

import { HomeRoomsStep } from "./HomeRoomsStep";

type Props = {
  details: HomeDetails;
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

const generateDefaultRoom = (): Room => ({
  id: uuidv4(),
  type: "LIVING",
  responses: {},
});

export const HomeAssessment: React.FC<Props> = ({ questions, details }) => {
  const [{ rooms, selectedRoomId }, setAssessment] = React.useState<
    HomeAssessmentData
  >(() => {
    const initialRoom = generateDefaultRoom();
    return {
      selectedRoomId: initialRoom.id,
      rooms: [initialRoom],
    };
  });

  const normalizedAndSortedRooms = React.useMemo(() => {
    const sortedRooms = sortRoomsBasedOnTypeAndName(rooms);
    return normalizeRoomNames(sortedRooms);
  }, [rooms]);

  const handleAddNewRoom = React.useCallback(() => {
    const newRoom = generateDefaultRoom();
    setAssessment((assessment) => ({
      ...assessment,
      rooms: [...assessment.rooms, newRoom],
      selectedRoomId: newRoom.id,
    }));
  }, []);

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
        updateRoomType(assessment, selectedRoomId, type)
      );
    },
    [selectedRoomId]
  );

  const handleUpdateRoomQuestion = React.useCallback(
    (
      questionId: string,
      answer: "YES" | "NO" | "UNSURE" | undefined,
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

  const handleUpdateSelectedRoom = React.useCallback((id: string) => {
    setAssessment((assessment) => ({ ...assessment, selectedRoomId: id }));
  }, []);

  const handleDeleteRoom = React.useCallback(
    (idToDelete: string) =>
      setAssessment((assessment) => deleteRoomAction(assessment, idToDelete)),
    []
  );

  const assessmentStepContent = (
    <Box>
      <HomeRoomsStep
        details={details}
        rooms={normalizedAndSortedRooms}
        selectedRoomId={selectedRoomId}
        addNewRoom={handleAddNewRoom}
        updateRoomName={handleUpdateRoomName}
        updateRoomType={handleUpdateRoomType}
        updateRoomQuestion={handleUpdateRoomQuestion}
        updateSelectedRoom={handleUpdateSelectedRoom}
        deleteRoom={handleDeleteRoom}
      />
    </Box>
  );

  return (
    <RoomAssessmentQuestionsContext.Provider value={questions}>
      <Box
        width="100%"
        marginTop="16pt"
        marginBottom="48pt"
        position="relative"
      >
        {assessmentStepContent}
      </Box>
    </RoomAssessmentQuestionsContext.Provider>
  );
};
