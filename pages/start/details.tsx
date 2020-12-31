import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { HomeAssessmentDetails } from "../../components/start/details/HomeAssessmentDetails";
import { OverrideAlert } from "../../components/start/details/OverrideAlert";

import { useHomeDetailsApi } from "../../components/start/hooks/useHomeDetailsApi";

import { HomeDetails } from "../../interfaces/home-assessment";

function AssessmentDetails() {
  const { loading, submitHomeDetails } = useHomeDetailsApi();
  const router = useRouter();
  const toast = useToast();

  const handleSubmitDetails = async (details: HomeDetails) => {
    const { successful, errors } = await submitHomeDetails(details);
    if (successful) {
      router.push("/start/evaluation");
    }

    errors.forEach((error) =>
      toast({
        status: "error",
        description: error.msg,
      })
    );
  };

  return (
    <Layout
      title="Details"
      description="Free home assessment: see if your Kingston student housing situation is in breach of any housing bylaws."
    >
      <OverrideAlert />
      <HomeAssessmentDetails
        loading={loading}
        submitDetails={handleSubmitDetails}
      />
    </Layout>
  );
}

export default AssessmentDetails;
