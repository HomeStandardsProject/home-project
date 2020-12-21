import { Skeleton, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";
import {
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../../interfaces/home-assessment";
import { LOCAL_STORAGE_SUBMISSION_ID_KEY } from "../hooks/useHomeDetailsApi";
import { HomeAssessment } from "./HomeAssessment";

type Props = {
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

// @ts-ignore argument spreading isn't playing nice with fetch
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

function HomeEvaluationContainer({ questions }: Props) {
  const [submissionId, setSubmissionId] = React.useState<
    string | undefined | null
  >(undefined);
  const toast = useToast();
  const router = useRouter();

  const { data, error } = useSWR(
    submissionId ? `/api/home-details/${submissionId}` : null,
    fetcher
  );

  React.useEffect(() => {
    const submissionId = localStorage.getItem(LOCAL_STORAGE_SUBMISSION_ID_KEY);
    setSubmissionId(submissionId);
  }, []);

  React.useEffect(() => {
    if (!data) {
      // submissionId is not set
      if (submissionId === null) {
        toast({
          status: "error",
          description: "Submission ID does not exist",
          position: "top-right",
        });
        router.push("/start/details");
      }
    }
  }, [data, submissionId, toast, router]);

  React.useEffect(() => {
    if (error) {
      console.error(error);
      toast({
        status: "error",
        description: error.message,
        position: "top-right",
      });
    }
  }, [toast, error]);

  if (data) {
    return <HomeAssessment questions={questions} details={data} />;
  }
  return (
    <Stack padding="8pt" rounded="lg" bg="gray.100" marginTop="16pt">
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  );
}

export default HomeEvaluationContainer;
