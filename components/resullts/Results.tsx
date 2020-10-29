import * as React from "react";
import { Box, Divider, Heading, Icon, Stack, Tag, Text } from "@chakra-ui/core";
import {
  ApiHomeAssessmentResult,
  ApiRoomAssessmentResult,
} from "../../interfaces/api-home-assessment";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { useLayoutType } from "../home-assessment/hooks/useLayoutType";

type Props = {
  assessment: ApiHomeAssessmentResult;
};

export const Results: React.FC<Props> = ({ assessment }) => {
  const layoutType = useLayoutType();
  const totalViolations = React.useMemo(
    () =>
      assessment.rooms.reduce(
        (count, room) => count + room.violations.length,
        0
      ),
    [assessment]
  );

  const generatedDate = new Intl.DateTimeFormat("en-US").format(
    new Date(assessment.generatedDate)
  );

  const isInline = layoutType === "desktop";

  return (
    <Stack marginTop="16pt" marginBottom="16pt" spacing={1}>
      <Heading as="h4" color="gray.700" size="md">
        {assessment.details.address}
      </Heading>
      <Stack isInline spacing={2}>
        <Tag size="sm" variantColor="green">
          ${assessment.details.totalRent}
        </Tag>
        <Tag size="sm" variantColor="green">
          {assessment.details.rentalType}
        </Tag>
        <Tag size="sm" variantColor="green">
          {assessment.details.landlordOther ?? assessment.details.landlord}
        </Tag>
      </Stack>
      <Box marginTop="8pt">
        <PDFDownloadButton result={assessment} />
      </Box>
      <Divider />
      <Box marginTop="16pt">
        <Heading as="h3" size="xl">
          {totalViolations} Violations
        </Heading>
        <Text color="gray.400">{generatedDate}</Text>
      </Box>
      <Box marginTop="16pt">
        <Heading as="h4" size="md">
          Breakdown
        </Heading>
        {assessment.rooms.map((room) => (
          <RoomViolations key={room.id} room={room} isInline={isInline} />
        ))}
      </Box>
    </Stack>
  );
};

const RoomViolations: React.FC<{
  room: ApiRoomAssessmentResult;
  isInline: boolean;
}> = ({ room, isInline }) => (
  <Stack marginTop="16pt" isInline={isInline}>
    <Text as="b" width="30%" minW="200px">
      {room.name}
    </Text>
    <Stack flexBasis="100%" spacing={4}>
      {room.violations.map((violation) => (
        <Box key={violation.name}>
          <Text as="i">{violation.name}</Text>
          <Text>{violation.description}</Text>
          {violation.userProvidedDescriptions.map((description, i) => (
            <Stack
              key={i}
              bg="blue.100"
              padding="4pt"
              isInline
              align="center"
              marginTop="8pt"
            >
              <Icon name="info-outline" />
              <Text>{description}</Text>
            </Stack>
          ))}
        </Box>
      ))}
      {room.violations.length === 0 && (
        <Stack
          padding="8pt"
          isInline
          align="center"
          marginTop="8pt"
          bg="blue.100"
          rounded="4pt"
        >
          <Box
            bg="blue.200"
            rounded="full"
            width="2em"
            height="2em"
            textAlign="center"
          >
            <Icon color="blue.500" name="check" marginTop="4pt" />
          </Box>
          <Text>No violations detected for this room</Text>
        </Stack>
      )}
    </Stack>
  </Stack>
);
