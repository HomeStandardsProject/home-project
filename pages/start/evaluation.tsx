import { GetStaticProps } from "next";
import * as React from "react";
import { fetchAvailableCitiesWithRules } from "../../api-functions/cms/ContentfulCities";
import {
  HomeEvaluationContainer,
  ParsedCityRules,
} from "../../components/start/evaluation/HomeEvaluationContainer";
import { loadBylawMultiplexerFromData } from "../../utils/loadBylawMultiplexer";

import { loadQuestionsFromJSON } from "../../utils/loadQuestions";

type Props = {
  cities: ParsedCityRules[];
};

const Evaluation: React.FC<Props> = ({ cities }) => {
  return <HomeEvaluationContainer cities={cities} />;
};

export const getStaticProps: GetStaticProps = async () => {
  // this approach to passing all the questions for EVERY city
  // probably won't scale well (could be a lot of data which will take up page size),
  // it should be fine for now and can be addressed once its a problem.
  const availableCities = await fetchAvailableCitiesWithRules();
  const cityWithParsedRules: ParsedCityRules[] = [];
  for (const city of availableCities) {
    // Unsused return value, however this is to make sure that the bylaw multiplexer
    // is validated at build time rather then at execution time
    const questions = loadQuestionsFromJSON(city.questions);
    cityWithParsedRules.push({ name: city.name, questions });
    loadBylawMultiplexerFromData(city.bylawMultiplexer, questions);
  }
  return { props: { cities: cityWithParsedRules } };
};

export default Evaluation;
