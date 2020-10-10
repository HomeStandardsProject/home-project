import * as React from "react";
import { HomeAssessment } from "../components/home-assessment/HomeAssessment";
import Layout from "../components/Layout";

const HomeAssessmentPage: React.FC = () => (
  <Layout title="Home Assessment">
    <HomeAssessment />
  </Layout>
);

export default HomeAssessmentPage;
