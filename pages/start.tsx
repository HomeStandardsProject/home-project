import { Skeleton, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import Layout from "../components/Layout";
import { LOCAL_STORAGE_SUBMISSION_ID_KEY } from "../components/start/hooks/useHomeDetailsApi";

function Start() {
  const router = useRouter();

  React.useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_SUBMISSION_ID_KEY)) {
      router.push("/start/evaluation");
    } else {
      router.push("/start/details");
    }
  }, [router]);

  return (
    <Layout
      title="Start your free home assessment"
      description="See if your Kingston student housing situation is in breach of any housing bylaws."
    >
      <Stack padding="8pt" rounded="lg" bg="gray.100" marginTop="16pt">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Layout>
  );
}

export default Start;
