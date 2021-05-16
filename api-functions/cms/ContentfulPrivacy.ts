import { gql } from "graphql-request";
import { PrivacyContent } from "../../interfaces/contentful-privacy";
import { client, CMS_ERRORS } from "./ContentfulLanding";

const privacyQuery = gql`
  query PrivacyPageContent {
    entryCollection(
      where: { contentfulMetadata: { tags: { id_contains_all: ["privacy"] } } }
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

export async function fetchPrivacy() {
  try {
    const data = await client.request(privacyQuery);
    if (!data || !data.entryCollection) throw CMS_ERRORS.unableToFetch;
    const content: Partial<PrivacyContent> = {};
    for (const item of data.entryCollection.items) {
      if (!item) continue;
      if (item.__typename === "RichTextOnly") {
        content.privacy = item;
      }
    }
    return content;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
