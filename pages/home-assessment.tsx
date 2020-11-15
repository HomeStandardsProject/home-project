import { GetStaticProps } from "next";
import * as React from "react";

import { HomeAssessment } from "../components/home-assessment/HomeAssessment";
import Layout from "../components/Layout";
import {
  RoomAssessmentQuestion,
  RoomTypes,
} from "../interfaces/home-assessment";
import { loadBylawMultiplexer } from "../utils/loadBylawMultiplexer";
import { loadQuestions } from "../utils/loadQuestions";

type Props = {
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

const HomeAssessmentPage: React.FC<Props> = ({ questions }) => (
  <Layout
    title="Assessment"
    description="Free home assessment: see if your Kingston student housing situation is in breach of any housing bylaws."
  >
    <HomeAssessment questions={questions} />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const questions = loadQuestions();
  // Unsused return value, however this is to make sure that the bylaw multiplexer
  // is validated at build time rather then at execution time
  loadBylawMultiplexer(questions);
  return { props: { questions } };
};

export default HomeAssessmentPage;
