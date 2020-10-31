import * as React from "react";

import Layout from "../components/Layout";
import { ResultsContainer } from "../components/resullts/ResultsContainer";

const ResultPage: React.FC = () => (
  <Layout title="Results" description="Results for the home assessment">
    <ResultsContainer />
  </Layout>
);

export default ResultPage;
