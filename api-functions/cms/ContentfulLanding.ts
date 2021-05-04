import { gql, GraphQLClient } from "graphql-request";
import { LandingContent } from "../../interfaces/contentful-landing";
import { GraphQLContentfulLandingPageContentQuery } from "./ContentfulQueries";

const landingPageQuery = gql`
  query LandingPageContent {
    entryCollection(
      where: { contentfulMetadata: { tags: { id_contains_all: ["landing"] } } }
    ) {
      items {
        __typename

        ... on LandingMetadata {
          title
          richDescription: description {
            json
          }
          buttonStartNow
          whyThisToolTitle
          howWeHelpTitle
          didYouKnowTitle
          kitchenIntro
          articleTitle
        }

        ... on OfferingExampleViolation {
          title
          description
          violationReason
          order
          markerLeftPosition
          markerTopPosition
        }

        ... on LandingFact {
          title
          description
          backgroundImage {
            url
          }
          order
          lightTextColor
        }

        ... on DidYouKnow {
          title
          description
          sourceName
          sourceUrl
          order
        }

        ... on LandingExplanation {
          icon
          richDescription: description {
            json
          }
          order
        }

        ... on RelevantArticle {
          title
          sourceUrl
          sourceName
          order
        }
      }
    }
  }
`;

export const CMS_ERRORS = {
  unableToFetch: new Error("unable to fetch content from CMS"),
  itemsUndefined: new Error("cms failed to return expected items"),
  metadataNotUnique: new Error(
    "Metadata already defined. Only one metadata field can be present"
  ),
  missingData: (field: string) =>
    new Error(`cms failed to return value for field: ${field}`),
};

export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_API_SPACE_ID}`,
  {
    headers: {
      authorization: `Bearer ${process.env.CONTENTFUL_API_KEY}`,
    },
  }
);

export async function fetchLanding() {
  try {
    const data = await client.request<GraphQLContentfulLandingPageContentQuery>(
      landingPageQuery
    );

    if (!data || !data.entryCollection) throw CMS_ERRORS.unableToFetch;
    const content: Partial<LandingContent> = {};
    for (const item of data.entryCollection.items) {
      if (!item) continue;
      switch (item.__typename) {
        case "LandingMetadata": {
          content.metadata = checkIfEachPropertyIsDefined(item);
          break;
        }
        case "LandingExplanation": {
          const value = checkIfEachPropertyIsDefined(item);
          content.explanations = [value, ...(content.explanations ?? [])];
          break;
        }
        case "LandingFact": {
          const value = checkIfEachPropertyIsDefined(item);
          const fact = {
            ...value,
            backgroundImage: {
              url: item.backgroundImage?.url ?? null,
            },
          };
          content.facts = [fact, ...(content.facts ?? [])];
          break;
        }
        case "RelevantArticle": {
          const value = checkIfEachPropertyIsDefined(item);
          content.relevantArticles = [
            value,
            ...(content.relevantArticles ?? []),
          ];
          break;
        }
        case "OfferingExampleViolation": {
          const value = checkIfEachPropertyIsDefined(item);
          content.violations = [value, ...(content.violations ?? [])];
          break;
        }
        case "DidYouKnow": {
          const value = checkIfEachPropertyIsDefined(item);
          content.didYouKnows = [value, ...(content.didYouKnows ?? [])];
          break;
        }
        default:
          break;
      }
    }

    // check to make sure all of the fields were defined
    for (const [key, val] of Object.entries(content)) {
      if (!val) throw CMS_ERRORS.missingData(key);
    }
    const requiredContent = content as Required<LandingContent>;

    // sort the content based on the order property
    const sortedContent: LandingContent = {
      metadata: requiredContent.metadata,
      facts: sortByOrder(requiredContent.facts),
      didYouKnows: sortByOrder(requiredContent.didYouKnows),
      violations: sortByOrder(requiredContent.violations),
      relevantArticles: sortByOrder(requiredContent.relevantArticles),
      explanations: sortByOrder(requiredContent.explanations),
    };
    return sortedContent;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}

export function sortByOrder<T extends { order: number }>(content: T[]): T[] {
  return content.sort((a, b) => a.order - b.order);
}

export function checkIfEachPropertyIsDefined<T extends { __typename: string }>(
  obj: T
): Required<T> {
  if (typeof obj !== "object")
    throw new Error("invalid value. Provided value is not an object");

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined)
      throw new Error(`Value of ${key} is undefined on ${obj.__typename}`);
  }
  return obj as Required<T>;
}
