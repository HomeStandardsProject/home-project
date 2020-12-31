import * as React from "react";
import { LOCAL_STORAGE_ASSESSMENT_KEY } from "../components/start/evaluation/hooks/useAssessmentCalculatorApi";
import { LOCAL_STORAGE_SUBMISSION_ID_KEY } from "../components/start/hooks/useHomeDetailsApi";

export function useUserStepState() {
  const [state, setState] = React.useState({
    hasSubmissionId: false,
    hasAssessmentResult: false,
  });

  React.useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_SUBMISSION_ID_KEY)) {
      setState({ hasSubmissionId: true, hasAssessmentResult: false });
    }
    if (localStorage.getItem(LOCAL_STORAGE_ASSESSMENT_KEY)) {
      setState({ hasSubmissionId: false, hasAssessmentResult: true });
    }
  }, []);
  return state;
}
