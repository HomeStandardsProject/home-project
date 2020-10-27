import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import * as React from "react";
import Layout from "../components/Layout";
import { Results } from "../components/resullts/Results";
import { ApiHomeAssessmentResult } from "../interfaces/api-home-assessment";

function isApiHomeAssessmentResult(data: {
  [key: string]: unknown;
}): data is ApiHomeAssessmentResult {
  return true;
}

const ResultPage: React.FC = () => {
  const [redirect, setRedirect] = React.useState(false);
  const [rawAssessment, setRawAssessment] = React.useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  const validatedAssessment = React.useMemo((): ApiHomeAssessmentResult | null => {
    if (rawAssessment) {
      const data = JSON.parse(rawAssessment);
      if (isApiHomeAssessmentResult(data)) {
        return data;
      }
      setRedirect(false);
    }
    return null;
  }, [rawAssessment]);

  React.useEffect(() => {
    setRawAssessment(localStorage.getItem("assessment"));
  }, []);

  React.useEffect(() => {
    if (redirect) {
      router.push("/");
      toast({ description: "Unable to parse assessment", status: "error" });
    }
  }, [toast, router, redirect]);

  return (
    <Layout title="Results">
      {validatedAssessment && <Results assessment={validatedAssessment} />}
    </Layout>
  );
};

export default ResultPage;
