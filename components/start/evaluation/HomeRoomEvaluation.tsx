import {
  AddIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Heading,
  Stack,
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { Flipped, Flipper } from "react-flip-toolkit";

import useSticky from "../../../hooks/useSticky";
import {
  NON_GENERAL_ROOM_TYPES,
  placeholderBasedOnType,
  Room,
  RoomAssessmentQuestion,
  RoomTypes,
  transformRoomTypeToLabel,
} from "../../../interfaces/home-assessment";

import { useRoomFromId, useRooms } from "./hooks/useHomeEvaluation";
import { useInvalidRoomIds } from "./hooks/useInvalidRoomIds";
import { RoomQuestion } from "./RoomQuestion";

type Props = {
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
  switchSteps: () => void;
  generatingReport: boolean;
  generateReport: () => void;
  showErrors: boolean;
};

export function HomeRoomEvaluation({
  questions,
  switchSteps,
  showErrors,
  generateReport,
  generatingReport,
}: Props) {
  const {
    rooms,
    selectedRoomId,
    addRoom,
    changeSelectedRoom,
    changeRoomType,
    changeName,
    deleteRoom,
  } = useRooms();
  const { room: selectedRoom, setResponseAnswer } = useRoomFromId(
    selectedRoomId
  );
  if (!selectedRoom) throw new Error("Selected room id does not exist");
  const { isSticky, elementToStick } = useSticky({ windowOffset: 65 });
  const shouldBecomeSticky = useBreakpointValue({ sm: false, md: true });
  const invalidRoomIds = useInvalidRoomIds(rooms, questions);

  const handleUpdateRoomType = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRoomType = event.target.value;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (
        newRoomType &&
        !NON_GENERAL_ROOM_TYPES.includes(newRoomType as RoomTypes)
      )
        throw new Error("invalid room type selected");

      changeRoomType(newRoomType as RoomTypes);
    },
    [changeRoomType]
  );

  const handleUpdateRoomName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetValue = event.target.value;
      changeName(targetValue);
    },
    [changeName]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (event.target.value === "") changeName(undefined);
    },
    [changeName]
  );

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedRoom.id]);

  const flipKey = React.useMemo(() => rooms.map((room) => room.name).join(""), [
    rooms,
  ]);

  const enableStickyness = isSticky && shouldBecomeSticky;

  return (
    <Stack maxWidth="950px" display="block" margin="0 auto">
      <Box>
        <Stack isInline justify="space-between" align="center">
          <Button
            leftIcon={<ArrowBackIcon />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={switchSteps}
          >
            Go back
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            rightIcon={<ArrowForwardIcon />}
            onClick={generateReport}
            isLoading={generatingReport}
          >
            Generate Report
          </Button>
        </Stack>
        <Heading size="lg" as="h2">
          Rooms
        </Heading>
        <Text marginTop={2} marginBottom={6}>
          Add all of the rooms in your house and answer the questions for each
          room. If you leave a question blank, you will be unable to generate a
          report. We recommend taking pictures of the issues as you go, so you
          can keep a visual record.
        </Text>
        <SimpleGrid
          marginTop="8pt"
          columns={{ sm: 1, md: 2 }}
          gridTemplateColumns={{ sm: "100%", md: "minmax(200px, 30%) 70%" }}
        >
          <div ref={elementToStick} style={{ position: "relative" }}>
            <Box
              bg="gray.100"
              margin="2pt"
              padding="4pt"
              rounded="md"
              minW="250px"
              position={enableStickyness ? "fixed" : "initial"}
              top={"65px"}
            >
              <Flipper flipKey={flipKey}>
                {rooms.map((room) => (
                  <Flipped key={room.id} flipId={room.id}>
                    <div>
                      <RoomComponent
                        room={room}
                        roomDeleted={deleteRoom}
                        roomSelected={changeSelectedRoom}
                        isSelected={room.id === selectedRoom.id}
                        isInvalid={
                          showErrors && invalidRoomIds.includes(room.id)
                        }
                        isDisabled={rooms.length === 1}
                      />
                    </div>
                  </Flipped>
                ))}
              </Flipper>
              <Button
                colorScheme="blue"
                w="100%"
                size="xs"
                leftIcon={<AddIcon />}
                variant="outline"
                onClick={addRoom}
              >
                Add Room
              </Button>
            </Box>
          </div>
          <Box padding="4pt" w="100%">
            <SimpleGrid
              marginBottom="16pt"
              columns={{ sm: 1, md: 2 }}
              spacing={4}
            >
              <FormControl flexBasis="100%">
                <FormLabel fontSize="sm" htmlFor="room-name">
                  Room Name
                </FormLabel>
                <Input
                  id="room-name"
                  placeholder={placeholderBasedOnType(selectedRoom.type)}
                  aria-describedby="room name"
                  size="md"
                  value={selectedRoom.name ?? ""}
                  onBlur={handleBlur}
                  onChange={handleUpdateRoomName}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Room Type</FormLabel>
                <Select
                  size="md"
                  isRequired={true}
                  value={selectedRoom.type}
                  minW={"150px"}
                  onChange={handleUpdateRoomType}
                >
                  {NON_GENERAL_ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {transformRoomTypeToLabel(type)}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
            <Box>
              {questions[selectedRoom.type].map((prompt) => (
                <RoomQuestion
                  key={`${prompt.id}-${selectedRoom.id}`}
                  prompt={prompt}
                  response={
                    selectedRoom.responses[prompt.id] ?? {
                      answer: undefined,
                      description: "",
                    }
                  }
                  showInvalidMarkerIfNeeded={showErrors}
                  answerChanged={setResponseAnswer}
                />
              ))}
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Stack>
  );
}

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
