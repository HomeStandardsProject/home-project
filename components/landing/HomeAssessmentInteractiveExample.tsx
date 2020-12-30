import { InfoIcon } from "@chakra-ui/icons";
import { Box, Stack, Image, Text, Tag } from "@chakra-ui/react";

import { motion, useAnimation } from "framer-motion";

import * as React from "react";
import { useLayoutType } from "../../hooks/useLayoutType";

const EXAMPLE_DATA = [
  {
    name: "5.57 Plumbing",
    description:
      "All plumbing, including every drain, water pipe, water closet and other plumbing fixtures in a Dwelling and every connecting line to the Sewerage System shall be Maintained in good working order and free from leaks or defects, and all water pipes and appurtenances thereto shall be protected from freezing.",
    comment: "The faucet drips.",
    top: 55,
    left: 30.5,
  },
  {
    name: "5.11 Doors and Windows",
    description:
      "Where storm windows and doors are installed in a dwelling that shall be Maintained in good Repair.",
    comment: "There is a noticeable draft from the edges of the windows",
    top: 37.5,
    left: 35,
  },
  {
    name: "5.49.3 Kitchen",
    description:
      "Work surfaces at least 1.2 metres (4 feet) in length x 60 centimeters (2 feet) in width, exclusive of the sink, that are impervious to moisture and grease and easily cleanable so as not to impart any toxic or deleterious effect to food.",
    comment:
      "The countertop behind the sink is damaged, which allows water to seep in.",
    top: 57.5,
    left: 50,
  },
  {
    name: "4.8 Appliance",
    comment: "The oven doesn't heat up.",
    description:
      "All appliances, equipment, accessories and installations provided by the Owner shall be installed and Maintained in good repair and working order and used for their intended purposes.",
    top: 74,
    left: 73,
  },
];

export function HomeAssessmentInteractiveExample() {
  const layoutType = useLayoutType();
  const violationsControls = useAnimation();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const isMobile = layoutType === "mobile";

  React.useEffect(() => {
    if (hoveredIndex !== null) {
      violationsControls.start((i) => ({
        scale: i === hoveredIndex ? 1.1 : 0.9,
      }));
    } else {
      violationsControls.start({
        scale: 1.0,
      });
    }
  }, [hoveredIndex, violationsControls]);

  return (
    <Box marginTop="16pt">
      <Stack isInline={!isMobile} align="center">
        <Box position="relative" order={isMobile ? 0 : 1}>
          <Image src="/kingston-kitchen.jpeg" borderRadius="lg" />
          {EXAMPLE_DATA.map((violation, i) => (
            <Annotation
              key={violation.name}
              top={violation.top}
              left={violation.left}
              number={i + 1}
              onHover={setHoveredIndex}
            />
          ))}
        </Box>
        <Stack flexBasis="50%" padding={2} order={isMobile ? 1 : 0}>
          {EXAMPLE_DATA.map((violation, i) => (
            <motion.div
              key={violation.name}
              custom={i}
              animate={violationsControls}
            >
              <ViolationContainer
                key={violation.name}
                violation={violation}
                number={i + 1}
              />
            </motion.div>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

function ViolationContainer(props: {
  violation: typeof EXAMPLE_DATA[number];
  number: number;
}) {
  return (
    <Stack
      px={3}
      py={2}
      bg="#f7fafc"
      boxShadow="lg"
      borderRadius="lg"
      borderWidth="1px"
      userSelect="none"
    >
      <Stack isInline align="center">
        <Tag size="sm" colorScheme="red">
          {props.number}
        </Tag>
        <Text as="b" fontSize="sm">
          {props.violation.name}
        </Text>
      </Stack>
      <Text fontSize="sm">{props.violation.description}</Text>
      <Stack
        bg="blue.100"
        borderRadius="md"
        marginTop={2}
        isInline
        align="center"
        px={2}
        py={1}
      >
        <InfoIcon color="blue.600" />
        <Text fontSize="xs" color="blue.800">
          {props.violation.comment}
        </Text>
      </Stack>
    </Stack>
  );
}

type AnnotationProps = {
  number: number;
  top: number;
  left: number;
  onHover: (index: number | null) => void;
};

function Annotation({ number, onHover, top, left }: AnnotationProps) {
  const handleMouseOver = React.useCallback(() => {
    onHover(number - 1);
  }, [onHover, number]);

  const handleMouseLeave = React.useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <Box
      width="24px"
      height="24px"
      position="absolute"
      bg="gray.50"
      top={`${top}%`}
      left={`${left}%`}
      color="gray.600"
      textAlign="center"
      fontSize="10pt"
      lineHeight="21px"
      borderRadius="full"
      fontWeight="bold"
      borderColor="gray.300"
      borderWidth="2px"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      userSelect="none"
      cursor="pointer"
    >
      {number}
    </Box>
  );
}
