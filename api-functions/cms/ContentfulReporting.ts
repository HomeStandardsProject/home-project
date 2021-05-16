import { gql } from "graphql-request";
import { ReportingContent } from "../../interfaces/contentful-reporting";
import { client, CMS_ERRORS } from "./ContentfulLanding";

const reportingQuery = gql`
  query AboutUsPageContent {
    entryCollection(
      where: {
        contentfulMetadata: { tags: { id_contains_all: ["reporting"] } }
      }
    ) {
      items {
        __typename
        ... on RichTextOnly {
          title
          richDescription: description {
            json
          }
        }
      }
    }
  }
`;

export async function fetchReporting() {
  try {
    const data = await client.request(reportingQuery);
    if (!data || !data.entryCollection) throw CMS_ERRORS.unableToFetch;
    const content: Partial<ReportingContent> = {};
    for (const item of data.entryCollection.items) {
      if (!item) continue;
      if (item.__typename === "RichTextOnly") {
        content.reporting = item;
      }
    }
    return content;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
