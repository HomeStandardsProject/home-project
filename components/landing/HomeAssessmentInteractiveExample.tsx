import { InfoIcon } from "@chakra-ui/icons";
import { Box, Stack, Image, Text, Tag, SimpleGrid } from "@chakra-ui/react";

import { motion, useAnimation } from "framer-motion";

import * as React from "react";
import { LandingExampleViolation } from "../../interfaces/contentful-landing";

type Props = {
  violations: LandingExampleViolation[];
};

export function HomeAssessmentInteractiveExample({ violations }: Props) {
  const violationsControls = useAnimation();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

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
      <SimpleGrid columns={{ sm: 1, md: 2 }} alignItems="center">
        <Box>
          <Box position="relative" order={{ sm: 0, md: 1 }}>
            <Image src="/kingston-kitchen.jpeg" borderRadius="lg" />
            {violations.map((violation, i) => (
              <Annotation
                key={violation.title}
                top={violation.markerTopPosition}
                left={violation.markerLeftPosition}
                number={i + 1}
                onHover={setHoveredIndex}
              />
            ))}
          </Box>
        </Box>
        <Stack padding={2} order={{ sm: 1, md: 1 }}>
          {violations.map((violation, i) => (
            <motion.div
              key={violation.title}
              custom={i}
              animate={violationsControls}
            >
              <ViolationContainer
                key={violation.title}
                violation={violation}
                number={i + 1}
              />
            </motion.div>
          ))}
        </Stack>
      </SimpleGrid>
    </Box>
  );
}

function ViolationContainer(props: {
  violation: LandingExampleViolation;
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
          {props.violation.title}
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
          {props.violation.violationReason}
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
