import * as React from "react";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { NextRouter, withRouter } from "next/router";
import { WarningIcon } from "@chakra-ui/icons";
import { LOCAL_STORAGE_ASSESSMENT_KEY } from "../home-assessment/hooks/useAssessmentCalculatorApi";

interface Props {
  children: React.ReactNode;
  router: NextRouter;
}

interface State {
  hasError: boolean;
  message: string | undefined;
}

class ResultsErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    message: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, message: error.message };
  }

  // eslint-disable-next-line class-methods-use-this
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  private handleStartAssessmentClick() {
    localStorage.removeItem(LOCAL_STORAGE_ASSESSMENT_KEY);
    this.props.router.push("/");
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Flex minH="400px" justifyContent="center" alignItems="center">
          <Stack textAlign="center">
            <Flex justifyContent="center">
              <WarningIcon w="50px" h="50px" />
            </Flex>
            <Heading size="lg">Unable to view this assessment</Heading>
            <Text>
              Looks like an error occured when trying to present the assessment
            </Text>
            <Box>
              <Button
                marginTop="16pt"
                size="sm"
                colorScheme="red"
                onClick={() => this.handleStartAssessmentClick()}
              >
                Start a new assessment
              </Button>
            </Box>
          </Stack>
        </Flex>
      );
    }

    return this.props.children ?? null;
  }
}

export default withRouter(ResultsErrorBoundary);
