import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/core";
import * as React from "react";
import {
  Room,
  RoomAssessmentQuestion,
  RoomTypes,
  ROOM_TYPES,
  transformRoomTypeToLabel,
} from "../../interfaces/home-assessment";
import { setAsUndefinedInsteadOfEmptyString } from "./helpers/setAsUndefinedInsteadOfEmptyString";

type Props = {
  room: Room;
  updateRoomName: (name: string | undefined) => void;
  updateRoomType: (type: RoomTypes) => void;
  updateQuestion: (
    id: string,
    answer: "YES" | "NO" | undefined,
    description: string | undefined
  ) => void;
};

export const RoomAssessment: React.FC<Props> = ({
  room,
  updateRoomName,
  updateRoomType,
  updateQuestion,
}) => {
  const handleUpdateRoomName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetValue = event.target.value;
      const newName = targetValue === "" ? undefined : targetValue;
      updateRoomName(newName);
    },
    [updateRoomName]
  );

  const handleUpdateRoomType = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRoomType = event.target.value;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (newRoomType && !ROOM_TYPES.includes(newRoomType as RoomTypes))
        throw new Error("invalid room type selected");

      updateRoomType(newRoomType as RoomTypes);
    },
    [updateRoomType]
  );

  return (
    <Box padding="4pt">
      <Stack isInline>
        <FormControl flexBasis="80%">
          <FormLabel fontSize="sm">Room name</FormLabel>
          <Input
            placeholder={placeholderBasedOnType(room.type)}
            aria-describedby="room name"
            size="md"
            value={room.name ?? ""}
            onChange={handleUpdateRoomName}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Room type</FormLabel>
          <Select
            size="md"
            isRequired={true}
            value={room.type}
            minW={"150px"}
            onChange={handleUpdateRoomType}
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {transformRoomTypeToLabel(type)}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Box marginTop="16pt">
        {room.questions.map((question) => (
          <RoomQuestion
            key={question.id}
            prompt={question}
            answerChanged={updateQuestion}
          />
        ))}
      </Box>
    </Box>
  );
};

const RoomQuestion: React.FC<{
  prompt: RoomAssessmentQuestion;
  answerChanged: (
    id: string,
    answer: "YES" | "NO" | undefined,
    description: string | undefined
  ) => void;
}> = ({ prompt, answerChanged }) => {
  const handleRadioGroupValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue === "YES" || newValue === "NO") {
        answerChanged(prompt.id, newValue, undefined);
        return;
      }
      throw new Error("unknown option value for prompt");
    },
    [prompt.id, answerChanged]
  );

  const handleDescriptionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = setAsUndefinedInsteadOfEmptyString(event.target.value);
      answerChanged(prompt.id, prompt.answer, newValue);
    },
    [answerChanged, prompt.answer, prompt.id]
  );

  const optionalTextbox = React.useMemo(
    () =>
      prompt.answer === prompt.promptForDescriptionOn ? (
        <Textarea
          placeholder="(Optional) describe the issue..."
          value={prompt.description}
          onChange={handleDescriptionChange}
        />
      ) : null,
    [
      prompt.answer,
      prompt.description,
      prompt.promptForDescriptionOn,
      handleDescriptionChange,
    ]
  );

  return (
    <Box marginTop="16pt">
      <Heading as="h5" size="sm" marginBottom="4pt">
        {prompt.question}
      </Heading>
      <RadioGroup onChange={handleRadioGroupValueChange} value={prompt.answer}>
        <Radio value="YES">Yes</Radio>
        <Radio value="NO">No</Radio>
      </RadioGroup>
      {optionalTextbox}
    </Box>
  );
};

function placeholderBasedOnType(type: Room["type"]) {
  switch (type) {
    case "BED":
      return "Finley's Room";
    case "LIVING":
      return "Upstairs living room";
    case "WASH":
      return "Upstairs bathroom";
    default:
      throw new Error("unimplemented room type");
  }
}
