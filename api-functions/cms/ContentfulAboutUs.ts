import { gql } from "graphql-request";

const aboutUsPageQuery = gql`
  query AboutUsPageContent {
    entryCollection(
      where: { contentfulMetadata: { tags: { id_contains_all: ["aboutUs"] } } }
    ) {
      items {
        __typename
        ... on AboutUs {
          title
          richDescription: description {
            json
          }
        }
      }
    }
  }
`;

// export async function fetchAboutUs() {

// }
