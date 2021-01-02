import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";

import { useRouter } from "next/router";
import {
  HomeDetails,
  HomeEvaluationData,
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../../interfaces/home-assessment";
import { logGenerateAssessmentButtonClick } from "../../../utils/analyticsEvent";
import { useAssessmentCalculatorApi } from "./hooks/useAssessmentCalculatorApi";

import { HomeGeneralEvaluation } from "./HomeGeneralEvaluation";
import { HomeRoomEvaluation } from "./HomeRoomEvaluation";
import {
  HomeEvaluationMutator,
  HomeEvaluationState,
  INITIAL_STATE,
} from "./hooks/useHomeEvaluation";
import { useHomeEvaluationProgress } from "./hooks/useHomeEvaluationProgress";

type Props = {
  submissionId: string;
  details: HomeDetails;
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

export function HomeEvaluation({ details, questions, submissionId }: Props) {
  const [evaluationData, setEvaluationData] = React.useState<
    HomeEvaluationData
  >(INITIAL_STATE);
  const progress = useHomeEvaluationProgress(evaluationData, questions);
  const {
    generatingAssessment,
    generateAssessment,
  } = useAssessmentCalculatorApi();
  const toast = useToast();
  const router = useRouter();
  const progressBarStyle = useBreakpointValue({ sm: "bar", md: "circular" });
  const [showErrors, setShowErrors] = React.useState(false);

  const handleSwitchStep = React.useCallback(() => {
    setEvaluationData((data) => ({
      ...data,
      step: data.step === "general" ? "rooms" : "general",
    }));
  }, []);

  const handleGenerateReport = React.useCallback(async () => {
    if (progress < 100) {
      setShowErrors(true);
      return;
    }

    logGenerateAssessmentButtonClick();

    const { successful, errors } = await generateAssessment(
      evaluationData.rooms,
      submissionId
    );

    if (successful) {
      router.push("/results");
    }

    if (errors) {
      errors.forEach((error) =>
        toast({
          status: "error",
          description: error.msg,
        })
      );
    }
  }, [
    router,
    evaluationData.rooms,
    toast,
    progress,
    generateAssessment,
    submissionId,
  ]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [evaluationData.step]);

  React.useEffect(() => {
    const listener = (event: BeforeUnloadEvent) => {
      if (progress > 0) {
        // how the browser knows to not close the tab.
        // eslint-disable-next-line no-param-reassign
        event.returnValue = "";
        return "";
      }
      return undefined;
    };

    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [progress]);

  const progressBar = React.useMemo(() => {
    // for some reason the breakpoint is undefined on mobile?
    return progressBarStyle === "circular" && progressBarStyle ? (
      <CircularProgress value={progress}>
        <CircularProgressLabel>{progress}%</CircularProgressLabel>
      </CircularProgress>
    ) : (
      <Box width="100%">
        <Progress value={progress} colorScheme="blue" size="sm" />
      </Box>
    );
  }, [progress, progressBarStyle]);

  return (
    <HomeEvaluationState.Provider value={evaluationData}>
      <HomeEvaluationMutator.Provider value={setEvaluationData}>
        <Box position="relative" height="64pt">
          <Box
            marginBottom="16pt"
            borderBottom="1px solid"
            borderColor="gray.100"
            bg="#f7fafc"
            right="16pt"
            left="16pt"
            position="fixed"
            zIndex="100"
            maxWidth="950px"
            display="block"
            margin="0 auto"
            padding="0.5rem"
          >
            <Box width="100%">
              <SimpleGrid columns={{ sm: 1, md: 2 }}>
                <Stack spacing="0">
                  <Text fontWeight="bold">{details.address.formatted}</Text>
                  <Text>{details.landlord}</Text>
                </Stack>
                <Box textAlign="right">{progressBar}</Box>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
        <Box marginTop={4}>
          {evaluationData.step === "general" ? (
            <HomeGeneralEvaluation
              questions={questions}
              switchStep={handleSwitchStep}
            />
          ) : (
            <HomeRoomEvaluation
              showErrors={showErrors}
              questions={questions}
              generatingReport={generatingAssessment}
              switchSteps={handleSwitchStep}
              generateReport={handleGenerateReport}
            />
          )}
        </Box>
      </HomeEvaluationMutator.Provider>
    </HomeEvaluationState.Provider>
  );
}
