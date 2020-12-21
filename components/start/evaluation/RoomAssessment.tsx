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
} from "@chakra-ui/react";
import * as React from "react";
import {
  Room,
  RoomAssessmentQuestion,
  RoomAssessmentQuestionResponse,
  RoomTypes,
  ROOM_TYPES,
  transformRoomTypeToLabel,
} from "../../../interfaces/home-assessment";
import { setAsUndefinedInsteadOfEmptyString } from "../helpers/setAsUndefinedInsteadOfEmptyString";
import { useRoomAssessmentQuestions } from "./hooks/useRoomAssessmentQuestions";

type Props = {
  room: Room;
  updateRoomName: (name: string | undefined) => void;
  updateRoomType: (type: RoomTypes) => void;
  updateQuestion: (
    id: string,
    answer: "YES" | "NO" | "UNSURE" | undefined,
    description: string | undefined
  ) => void;
};

const DEFAULT_RESPONSE: RoomAssessmentQuestionResponse = {
  answer: undefined,
  description: undefined,
};

export const RoomAssessment: React.FC<Props> = ({
  room,
  updateRoomName,
  updateRoomType,
  updateQuestion,
}) => {
  const questions = useRoomAssessmentQuestions();

  const questionsForType = React.useMemo(() => questions[room.type], [
    questions,
    room.type,
  ]);

  const handleUpdateRoomName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetValue = event.target.value;
      updateRoomName(targetValue);
    },
    [updateRoomName]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (value === "") updateRoomName(undefined);
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
          <FormLabel fontSize="sm" htmlFor="room-name">
            Room name
          </FormLabel>
          <Input
            id="room-name"
            placeholder={placeholderBasedOnType(room.type)}
            aria-describedby="room name"
            size="md"
            value={room.name ?? ""}
            onBlur={handleBlur}
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
        {questionsForType.map((question) => (
          <RoomQuestion
            key={question.id}
            prompt={question}
            response={room.responses[question.id] ?? DEFAULT_RESPONSE}
            answerChanged={updateQuestion}
          />
        ))}
      </Box>
    </Box>
  );
};

const RoomQuestion: React.FC<{
  prompt: RoomAssessmentQuestion;
  response: RoomAssessmentQuestionResponse;
  answerChanged: (
    id: string,
    answer: "YES" | "NO" | "UNSURE" | undefined,
    description: string | undefined
  ) => void;
}> = ({ prompt, response, answerChanged }) => {
  const handleRadioGroupValueChange = React.useCallback(
    (newValue: string) => {
      if (newValue === "YES" || newValue === "NO" || newValue === "UNSURE") {
        answerChanged(prompt.id, newValue, undefined);
        return;
      }
      throw new Error("unknown option value for prompt");
    },
    [prompt.id, answerChanged]
  );

  const handleDescriptionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = setAsUndefinedInsteadOfEmptyString(event.target.value);
      answerChanged(prompt.id, response.answer, newValue);
    },
    [answerChanged, response.answer, prompt.id]
  );

  const optionalTextbox = React.useMemo(
    () =>
      response.answer === prompt.promptForDescriptionOn ? (
        <Textarea
          placeholder="(Optional) describe the issue..."
          value={response.description}
          onChange={handleDescriptionChange}
        />
      ) : null,
    [
      response.answer,
      response.description,
      prompt.promptForDescriptionOn,
      handleDescriptionChange,
    ]
  );

  return (
    <Box marginTop="16pt">
      <Heading as="h5" size="sm" marginBottom="4pt">
        {prompt.question}
      </Heading>
      <RadioGroup
        onChange={handleRadioGroupValueChange}
        value={response.answer}
      >
        <Stack>
          <Radio value="YES">Yes</Radio>
          <Radio value="NO">No</Radio>
          <Radio value="UNSURE">Unsure</Radio>
        </Stack>
      </RadioGroup>
      {optionalTextbox}
    </Box>
  );
};

function placeholderBasedOnType(type: Room["type"]) {
  const label: { [key in Room["type"]]: string } = {
    BED: "Finley's Room",
    LIVING: "Upstairs living room",
    WASH: "Main washroom",
    KITCHEN: "Kitchen",
    ENTRANCE: "Main Entrance",
    EXTERIOR: "Exterior",
    HEATING: "Heating",
  };

  return label[type];
}
