import * as React from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  ArrowForwardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoOutlineIcon,
  QuestionIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import { AnimatePresence, motion } from "framer-motion";
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
  const [collapseDisclaimer, setCollapseDiscaimer] = React.useState(true);
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

  const handleDisclaimerButtonClick = React.useCallback(() => {
    setCollapseDiscaimer((val) => !val);
  }, []);

  return (
    <Stack marginTop="16pt" marginBottom="16pt" spacing={4}>
      <Box>
        <Heading as="h4" color="gray.700" size="md">
          {assessment.details.address.formatted}
        </Heading>
        <SimpleGrid
          isInline
          columns={{ base: 1, sm: 3 }}
          templateColumns={{
            base: "min-content",
            sm: "min-content min-content min-content",
          }}
          spacing={2}
        >
          <Tag size="sm" colorScheme="green" py="4pt" whiteSpace="nowrap">
            ${assessment.details.totalRent}
          </Tag>
          <Tag size="sm" colorScheme="green" py="4pt" whiteSpace="nowrap">
            {assessment.details.rentalType}
          </Tag>
          <Tag size="sm" colorScheme="green" py="4pt" whiteSpace="nowrap">
            {assessment.details.landlordOther ?? assessment.details.landlord}
          </Tag>
          {assessment.details.unitNumber && (
            <Tag size="sm" colorScheme="green">
              Unit {assessment.details.unitNumber}
            </Tag>
          )}
        </SimpleGrid>
      </Box>
      <Stack
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.200"
        padding="8pt"
        bg="gray.100"
      >
        <Stack align="center" isInline justify="space-between">
          <Stack isInline align="center">
            <WarningTwoIcon color="gray.700" />
            <Text fontWeight="bold" textColor="gray.700">
              Disclaimer
            </Text>
          </Stack>
          <Box>
            <IconButton
              icon={
                collapseDisclaimer ? <ChevronUpIcon /> : <ChevronDownIcon />
              }
              size="sm"
              aria-label="Close Disclaimer"
              onClick={handleDisclaimerButtonClick}
            />
          </Box>
        </Stack>
        <AnimatePresence initial={false}>
          {collapseDisclaimer && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { height: "auto" },
                collapsed: { height: 0, overflow: "hidden" },
              }}
              transition={{ duration: 0.4 }}
            >
              <Stack>
                <Text>
                  Please note that, due to the nature of self assessments, The
                  Home Standards Project does not assume any liability for
                  inaccurate home assessments. We encourage you to check your
                  lease for any unique stipulations. What that liability could
                  be, we&apos;re not sure. But we don&apos;t want it.
                </Text>
                <Text>
                  Due to the length and wide scope of the property bylaws, we
                  have opted to only include those which have been found to be
                  the most common violations. We encourage you to review your
                  city's bylaws if you are concerned about the quality of your
                  unit. We also suggest that you take photos of any violations, 
                  document them with the date and include them in your message 
                  to your landlord.
                </Text>
                <Box>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={handleDisclaimerButtonClick}
                  >
                    Close
                  </Button>
                </Box>
              </Stack>
            </motion.section>
          )}
        </AnimatePresence>
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
        borderRadius="md"
      >
        <InfoOutlineIcon />
        <Text>{description}</Text>
      </Stack>
    ))}
  </Box>
);
