import { Box, Skeleton, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";
import * as React from "react";
import useSWR from "swr";
import {
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../../interfaces/home-assessment";
import { fetcher } from "../../../utils/fetcher";
import { LOCAL_STORAGE_SUBMISSION_ID_KEY } from "../hooks/useHomeDetailsApi";
import { HomeEvaluation } from "./HomeEvaluation";

export type ParsedCityRules = {
  name: string;
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

type Props = {
  cities: ParsedCityRules[];
};

export function HomeEvaluationContainer({ cities }: Props) {
  const [submissionId, setSubmissionId] = React.useState<
    string | undefined | null
  >(undefined);
  const toast = useToast();
  const router = useRouter();

  const { data, error } = useSWR(
    submissionId ? `/api/home-details/${submissionId}` : null,
    fetcher
  );

  const questions = React.useMemo(() => {
    if (!data) return null;
    const matchingCities = cities.filter(
      (i) => i.name === (data.city as string)
    );
    if (matchingCities.length !== 1) {
      toast({
        status: "error",
        title: `unable to find questions for city ${data.city}`,
      });
      return null;
    }
    return matchingCities[0].questions;
  }, [data, toast, cities]);

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

  return (
    <Box
      minHeight="100vh"
      padding="24pt"
      paddingTop="0pt"
      boxSizing="border-box"
      width="100%"
    >
      <Head>
        <title>Evaluation</title>
      </Head>
      {data && submissionId && questions ? (
        <HomeEvaluation
          questions={questions}
          details={data}
          submissionId={submissionId}
        />
      ) : (
        <Stack paddingTop="8pt" maxWidth="950px" margin="0 auto">
          <Skeleton height="15px" />
          <Skeleton height="15px" />
        </Stack>
      )}
    </Box>
  );
}
