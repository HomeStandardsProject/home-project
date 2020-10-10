import {
  Box,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/core";
import * as React from "react";
import {
  Room,
  ROOM_TYPES,
  transformRoomTypeToLabel,
} from "../../interfaces/home-assessment";

type Props = {
  room: Room;
  dataChanged: (room: Room) => void;
};

export const RoomAssessment: React.FC<Props> = ({ room, dataChanged }) => {
  const updateRoomName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetValue = event.target.value;
      const newName = targetValue === "" ? undefined : targetValue;
      dataChanged({ ...room, name: newName });
    },
    [room, dataChanged]
  );

  const updateRoomType = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRoomType = event.target.value;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (!ROOM_TYPES.includes(newRoomType as Room["type"]))
        throw new Error("invalid room type selected");

      dataChanged({ ...room, type: newRoomType as Room["type"] });
    },
    [room, dataChanged]
  );

  const [value, setValue] = React.useState("1");

  return (
    <Box padding="4pt">
      <Stack isInline>
        <Stack flexBasis="80%">
          <Text as="label" fontSize="sm">
            Room name (optional)
          </Text>
          <Input
            placeholder={placeholderBasedOnType(room.type)}
            aria-describedby="room name"
            size="md"
            value={room.name ?? ""}
            onChange={updateRoomName}
          />
        </Stack>
        <Stack>
          <Text as="label" fontSize="sm">
            Room type
          </Text>
          <Select
            placeholder="Select option"
            size="md"
            isRequired={true}
            value={room.type}
            onChange={updateRoomType}
          >
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {transformRoomTypeToLabel(type)}
              </option>
            ))}
          </Select>
        </Stack>
      </Stack>
      <Box marginTop="8pt">
        <Heading as="h3" size="sm" marginBottom="4pt">
          Are all of the appliances and equipment provided by the landlord
          installed and in good repair and working order?
        </Heading>
        <RadioGroup onChange={(e) => setValue(e.target.value)} value={value}>
          <Radio value="1">Yes</Radio>
          <Radio value="2">No</Radio>
        </RadioGroup>
      </Box>
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
