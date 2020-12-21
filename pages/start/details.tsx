import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { HomeAssessmentDetails } from "../../components/start/HomeAssessmentDetails";

import { useHomeDetailsApi } from "../../components/start/hooks/useHomeDetailsApi";
import { HomeDetails } from "../../interfaces/home-assessment";

function AssessmentDetails() {
  const { loading, submitHomeDetails } = useHomeDetailsApi();
  const router = useRouter();

  const handleSubmitDetails = async (details: HomeDetails) => {
    const { successful } = await submitHomeDetails(details);
    if (successful) {
      router.push("/start/evaluation");
    }
  };

  return (
    <Layout
      title="Details"
      description="Free home assessment: see if your Kingston student housing situation is in breach of any housing bylaws."
    >
      <HomeAssessmentDetails
        loading={loading}
        submitDetails={handleSubmitDetails}
      />
    </Layout>
  );
}

export default AssessmentDetails;
