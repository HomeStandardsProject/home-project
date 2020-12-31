import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  ArrowForwardIcon,
  CheckIcon,
  ExternalLinkIcon,
  InfoOutlineIcon,
  QuestionIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import {
  ApiBylawViolation,
  ApiHomeAssessmentResult,
  ApiRoomAssessmentResult,
} from "../../interfaces/api-home-assessment";

import { PDFDownloadButton } from "./PDFDownloadButton";

type Props = {
  assessment: ApiHomeAssessmentResult;
};

export const Results: React.FC<Props> = ({ assessment }) => {
  const totalViolations = React.useMemo(
    () =>
      assessment.rooms.reduce(
        (last, room) => ({
          normal: last.normal + room.violations.length,
          possible: last.possible + room.possibleViolations.length,
        }),
        { normal: 0, possible: 0 }
      ),
    [assessment]
  );

  const generatedDate = new Intl.DateTimeFormat("en-US").format(
    new Date(assessment.generatedDate)
  );

  return (
    <Stack marginTop="16pt" marginBottom="16pt" spacing={4}>
      <Box>
        <Heading as="h4" color="gray.700" size="md">
          {assessment.details.address.formatted}
        </Heading>
        <Stack isInline spacing={2}>
          <Tag size="sm" colorScheme="green">
            ${assessment.details.totalRent}
          </Tag>
          <Tag size="sm" colorScheme="green">
            {assessment.details.rentalType}
          </Tag>
          <Tag size="sm" colorScheme="green">
            {assessment.details.landlordOther ?? assessment.details.landlord}
          </Tag>
          {assessment.details.unitNumber && (
            <Tag size="sm" colorScheme="green">
              Unit {assessment.details.unitNumber}
            </Tag>
          )}
        </Stack>
      </Box>
      <Stack
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
        padding="8pt"
        bg="gray.100"
      >
        <Stack align="center" isInline>
          <WarningTwoIcon color="gray.700" />
          <Text fontWeight="bold" textColor="gray.700">
            Disclaimer
          </Text>
        </Stack>
        <Stack>
          <Text>
            Please note, while The Home Project and QBACC do their best to
            provide you with accurate home assessments, we do not assume any
            liability for inaccurate home assessments. Be sure to check your
            leases for any further stipulations.
          </Text>
          <Text>
            For more information on{" "}
            <Link
              href="https://www.cityofkingston.ca/resident/property-standards"
              color="blue.700"
              isExternal
            >
              Kingston property standards
              <ExternalLinkIcon />
            </Link>
            .
          </Text>
        </Stack>
      </Stack>
      <Divider />
      <Box>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4}>
          <Box>
            <Stack spacing={0}>
              <Box>
                <Tag colorScheme="blue" size="sm">
                  {totalViolations.possible} Possible Violations
                </Tag>
              </Box>
              <Heading as="h3" size="xl">
                {totalViolations.normal} Violations
              </Heading>
            </Stack>
            <Text color="gray.400">{generatedDate}</Text>
          </Box>
          <Stack
            isInline
            spacing={2}
            justify={{ sm: "flex-start", md: "flex-end" }}
          >
            <PDFDownloadButton result={assessment} />
            <NextLink href="next-steps">
              <Button
                varient="outline"
                colorScheme="orange"
                size="sm"
                rightIcon={<ArrowForwardIcon />}
              >
                Next Steps
              </Button>
            </NextLink>
          </Stack>
        </SimpleGrid>
        <Box marginTop="16pt">
          <Heading as="h4" size="md">
            Rooms
          </Heading>
          {assessment.rooms.map((room) => (
            <RoomViolations key={room.id} room={room} />
          ))}
        </Box>
      </Box>
    </Stack>
  );
};

const RoomViolations: React.FC<{
  room: ApiRoomAssessmentResult;
}> = ({ room }) => {
  const hasViolationOrPossibleOnes = React.useMemo(
    () => room.possibleViolations.length > 0 || room.violations.length > 0,
    [room.possibleViolations.length, room.violations.length]
  );

  return (
    <SimpleGrid
      marginTop="16pt"
      columns={{ sm: 1, md: 2 }}
      gridTemplateColumns={{ sm: "100%", md: "minmax(200px, 30%) 70%" }}
    >
      <Text as="b">{room.name}</Text>
      <Stack flexBasis="100%" spacing={2}>
        <Stack alignItems="center" isInline>
          <WarningIcon color="red.600" />
          <Text fontSize="lg" as="b" color="red.600">
            Violations
          </Text>
        </Stack>
        {room.violations.map((violation) => (
          <RoomViolation key={violation.id} violation={violation} />
        ))}

        {room.possibleViolations.length > 0 && (
          <>
            <Stack alignItems="center" isInline>
              <QuestionIcon color="blue.600" />
              <Text fontSize="lg" as="b" color="blue.600">
                Possible Violations
              </Text>
            </Stack>
            {room.possibleViolations.map((violation) => (
              <RoomViolation key={violation.id} violation={violation} />
            ))}
          </>
        )}

        {!hasViolationOrPossibleOnes && (
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
              <CheckIcon color="blue.500" marginTop="4pt" />
            </Box>
            <Text>No violations detected for this room</Text>
          </Stack>
        )}
        <Divider />
      </Stack>
    </SimpleGrid>
  );
};

const RoomViolation: React.FC<{ violation: ApiBylawViolation }> = ({
  violation,
}) => (
  <Box marginBottom={"8pt"}>
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
        <InfoOutlineIcon />
        <Text>{description}</Text>
      </Stack>
    ))}
  </Box>
);
