import { GetStaticProps } from "next";
import * as React from "react";

import { HomeAssessment } from "../components/home-assessment/HomeAssessment";
import Layout from "../components/Layout";
import {
  RoomAssessmentQuestion,
  RoomTypes,
} from "../interfaces/home-assessment";
import { fetchQuestionsBasedOnEnv } from "../api/utils/fetchQuestionsBasedOnEnv";

type Props = {
  questions: { [type in RoomTypes]: RoomAssessmentQuestion[] };
};

const HomeAssessmentPage: React.FC<Props> = ({ questions }) => (
  <Layout title="Home Assessment">
    <HomeAssessment questions={questions} />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const questions = await fetchQuestionsBasedOnEnv();
  return { props: { questions } };
};

export default HomeAssessmentPage;
