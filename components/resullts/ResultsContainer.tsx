import * as React from "react";

import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { ApiHomeAssessmentResult } from "../../interfaces/api-home-assessment";
import { Results } from "./Results";
import ResultsErrorBoundary from "./ResultsErrorBoundary";

export const ResultsContainer: React.FC = () => {
  const [rawAssessment, setRawAssessment] = React.useState<
    string | undefined | null
  >(undefined);
  const router = useRouter();
  const toast = useToast();

  const validatedAssessment = React.useMemo(():
    | ApiHomeAssessmentResult
    | null
    | undefined => {
    if (rawAssessment) {
      return JSON.parse(rawAssessment) as ApiHomeAssessmentResult;
    }
    return rawAssessment === undefined ? undefined : null;
  }, [rawAssessment]);

  React.useEffect(() => {
    setRawAssessment(localStorage.getItem("assessment"));
  }, []);

  React.useEffect(() => {
    if (validatedAssessment === null) {
      router.push("/");
      toast({ description: "Unable to parse assessment", status: "error" });
    }
  }, [toast, router, validatedAssessment]);

  return (
    <ResultsErrorBoundary>
      {validatedAssessment && <Results assessment={validatedAssessment} />}
    </ResultsErrorBoundary>
  );
};
