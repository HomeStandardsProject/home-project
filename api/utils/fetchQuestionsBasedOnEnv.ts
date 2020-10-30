import { AirtableStore } from "../datastore/Airtable";
import QuestionsData from "../../data/kingston/questions.json";
import {
  RoomAssessmentQuestion,
  RoomTypes,
} from "../../interfaces/home-assessment";

// Variable is set at build time when `fetchQuestionsBasedOnEnv` is called
// from the getStaticProps
let _QUESTIONS:
  | {
      [type in RoomTypes]: RoomAssessmentQuestion[];
    }
  | undefined;

export async function getStaticQuestions() {
  if (_QUESTIONS) {
    return _QUESTIONS;
  }
  const questions = await fetchQuestionsBasedOnEnv();
  _QUESTIONS = questions;
  return questions;
}

export async function fetchQuestionsBasedOnEnv() {
  let questions: { [type in RoomTypes]: RoomAssessmentQuestion[] } = {
    BED: [],
    WASH: [],
    KITCHEN: [],
  };

  try {
    if (process.env.AIRTABLE_SUBMISSIONS_BASE) {
      const airtable = new AirtableStore(process.env.AIRTABLE_SUBMISSIONS_BASE);
      questions = await airtable.fetchQuestions();
      console.log(
        "Airtable key specified and questions exist in base. Using questions from Airtable."
      );
    } else {
      console.log(
        "`questions` table does not exist in base. Using questions from JSON file"
      );
      questions = jsonQuestions();
    }
  } catch (error) {
    console.log("Airtable key not provided. Using questions from JSON file");
    questions = jsonQuestions();
  }
  _QUESTIONS = questions;
  return questions;
}

function jsonQuestions() {
  const questions = QuestionsData as {
    [type in RoomTypes]: RoomAssessmentQuestion[];
  };
  return questions;
}
