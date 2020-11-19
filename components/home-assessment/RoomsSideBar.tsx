import * as React from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Box,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { AddIcon, DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Room,
  transformRoomTypeToLabel,
} from "../../interfaces/home-assessment";
import { useIsAssessmentValid } from "./hooks/useIsAssessmentValid";
import { logGenerateAssessmentButtonClick } from "../../utils/analyticsEvent";

type Props = {
  rooms: Room[];
  selectedRoomId: string;
  generatingAssessment: boolean;
  addRoom: () => void;
  deleteRoom: (id: string) => void;
  changedSelectedRoom: (id: string) => void;
  generateReport: () => void;
};

export const RoomsSideBar: React.FC<Props> = ({
  rooms,
  generatingAssessment,
  changedSelectedRoom,
  addRoom,
  deleteRoom,
  generateReport,
  selectedRoomId,
}) => {
  const toast = useToast();
  // only show error state after the user first tries to generate a report
  const [showErrors, setShowErrors] = React.useState(false);
  const [isAssessmentValid, invalidRoomIds] = useIsAssessmentValid(rooms);
  const preventDeletionOfFirstRoom = React.useMemo(() => rooms.length === 1, [
    rooms.length,
  ]);

  const handleGenerateReport = React.useCallback(() => {
    if (isAssessmentValid) {
      generateReport();
      logGenerateAssessmentButtonClick();
    } else {
      setShowErrors(true);
      toast({
        description: "Please complete all prompts before proceeding",
        status: "error",
        position: "top-right",
      });
    }
  }, [isAssessmentValid, toast, generateReport]);

  const flipKey = React.useMemo((): string => {
    if (rooms.length === 0) return "fallback";
    return rooms[0].id;
  }, [rooms]);

  return (
    <Box bg="gray.100" margin="2pt" padding="4pt" rounded="md">
      <Stack isInline align="center" justifyContent="space-between">
        <Heading as="h3" size="xs" textTransform="uppercase">
          Rooms
        </Heading>
        <Button
          variant="outline"
          colorScheme="green"
          leftIcon={<AddIcon />}
          size="xs"
          onClick={addRoom}
        >
          Add room
        </Button>
      </Stack>
      <Box marginTop="8pt">
        <Flipper flipKey={flipKey}>
          {rooms.map((room, i) => (
            <Flipped key={room.id} flipId={room.id}>
              <div>
                <RoomComponent
                  room={room}
                  roomDeleted={deleteRoom}
                  roomSelected={changedSelectedRoom}
                  isSelected={room.id === selectedRoomId}
                  isInvalid={showErrors && invalidRoomIds.includes(room.id)}
                  isDisabled={i === 0 ? preventDeletionOfFirstRoom : false}
                />
              </div>
            </Flipped>
          ))}
        </Flipper>
      </Box>
      <Button
        marginTop={"16pt"}
        colorScheme="blue"
        size="sm"
        width="100%"
        onClick={handleGenerateReport}
        isLoading={generatingAssessment}
      >
        {generatingAssessment ? `Generating report...` : "Generate report"}
      </Button>
    </Box>
  );
};

const RoomComponent: React.FC<{
  room: Room;
  isSelected: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  roomSelected: (id: string) => void;
  roomDeleted: (id: string) => void;
}> = ({
  room,
  isDisabled,
  isSelected,
  isInvalid,
  roomSelected,
  roomDeleted,
}) => {
  const handleRoomSelect = React.useCallback(() => roomSelected(room.id), [
    roomSelected,
    room.id,
  ]);

  const handleRoomDelete = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      roomDeleted(room.id);
    },
    [roomDeleted, room.id]
  );

  return (
    <Box
      rounded="md"
      borderWidth={"1pt"}
      borderColor={isSelected ? "gray.300" : "gray.100"}
      marginBottom="4pt"
      _hover={{ bg: "gray.300", cursor: "pointer" }}
      _focus={{ boxShadow: "outline" }}
      onClick={handleRoomSelect}
    >
      <Flex padding="4pt" alignItems="center">
        <Stack spacing={0} flexBasis="100%">
          <Stack isInline>
            {isInvalid && <WarningIcon color="red.500" />}
            <Text as="b" fontSize="sm" color="gray.600">
              {room.name}
            </Text>
          </Stack>
          <Text fontSize="xs">{transformRoomTypeToLabel(room.type)} </Text>
        </Stack>
        <IconButton
          colorScheme="gray"
          aria-label="delete"
          size="sm"
          opacity={0.8}
          icon={<DeleteIcon />}
          variant="ghost"
          onClick={handleRoomDelete}
          isDisabled={isDisabled}
          isRound
        />
      </Flex>
    </Box>
  );
};
