import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Stack,
  Text,
  Icon,
  Button,
  Box,
} from "@chakra-ui/react";
import * as React from "react";
import { GiDoor, GiThermometerHot } from "react-icons/gi";
import { BsFillHouseFill } from "react-icons/bs";
import { AiFillBug } from "react-icons/ai";
import { IconType } from "react-icons";
import {
  GENERAL_ROOM_TYPES,
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../../interfaces/home-assessment";
import { RoomQuestion } from "./RoomQuestion";
import { useRoomFromId } from "./hooks/useHomeEvaluation";

type Props = {
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
  switchStep: () => void;
};

type SectionType = { name: string; icon: IconType };

const SECTIONS: {
  [key in typeof GENERAL_ROOM_TYPES[number]]: SectionType;
} = {
  PESTS: { name: "Pests", icon: AiFillBug },
  ENTRANCE: { name: "Entrance", icon: GiDoor },
  HEATING: { name: "Heating", icon: GiThermometerHot },
  EXTERIOR: { name: "Exterior", icon: BsFillHouseFill },
};

export function HomeGeneralEvaluation({ questions, switchStep }: Props) {
  return (
    <Stack maxWidth="950px" display="block" margin="0 auto">
      <Heading size="lg" as="h2">
        General
      </Heading>
      <Text>
        Click to expand each section. Questions are optional but answering is
        highly encouraged to better understand the state of your rental.
      </Text>
      <Accordion allowToggle>
        {Object.entries(SECTIONS).map(([roomType, section]) => (
          <RoomAccordionSection
            key={section.name}
            section={section}
            questions={questions[roomType as RoomTypes]}
            roomType={roomType as RoomTypes}
          />
        ))}
      </Accordion>
      <Box>
        <Button
          colorScheme="blue"
          size="md"
          marginTop="8pt"
          onClick={switchStep}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
}

function RoomAccordionSection({
  section,
  questions,
  roomType,
}: {
  roomType: RoomTypes;
  section: SectionType;
  questions: RoomAssessmentQuestion[];
}) {
  const { room, setResponseAnswer } = useRoomFromId(`default-${roomType}`);
  if (!room) {
    throw new Error(`Room of type ${roomType} does not exist in state`);
  }

  return (
    <AccordionItem>
      <AccordionButton>
        <Stack flex="1" isInline align="center">
          <Icon as={section.icon} color="blac.500" w={6} h={6} />
          <Heading as="h3" textAlign="left" size="sm">
            {section.name}
          </Heading>
        </Stack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        {questions.map((prompt) => (
          <RoomQuestion
            key={`${section.name}-${prompt.id}`}
            prompt={prompt}
            response={
              room.responses[prompt.id] ?? { answer: null, description: "" }
            }
            answerChanged={setResponseAnswer}
          />
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
}
