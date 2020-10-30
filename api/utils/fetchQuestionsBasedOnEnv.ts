import Airtable from "airtable";
import { AirtableStore } from "../datastore/Airtable";
import QuestionsData from "../../data/kingston/questions.json";
import {
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../interfaces/home-assessment";

export async function fetchQuestionsBasedOnEnv() {
  let questions: { [type in RoomTypes]: RoomAssessmentQuestion[] } = {
    BED: [],
    WASH: [],
    KITCHEN: [],
  };

  try {
    if (process.env.AIRTABLE_SUBMISSIONS_BASE && process.env.AIRTABLE_API_KEY) {
      Airtable.configure({
        apiKey: process.env.AIRTABLE_API_KEY,
        apiVersion: undefined,
        endpointUrl: undefined,
        noRetryIfRateLimited: undefined,
      });

      const airtable = new AirtableStore(process.env.AIRTABLE_API_KEY);
      questions = await airtable.fetchQuestions();
      console.log(
        "Airtable key specified and questions exist in base. Using questions from Airtable."
      );
    } else {
      questions = jsonQuestions();
    }
  } catch (error) {
    questions = jsonQuestions();
  }

  return questions;
}

function jsonQuestions() {
  console.log("Airtable key not provided. Using questions from JSON file");
  const questions = QuestionsData as {
    [type in RoomTypes]: RoomAssessmentQuestion[];
  };
  return questions;
}
