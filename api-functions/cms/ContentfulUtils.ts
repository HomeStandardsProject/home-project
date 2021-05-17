import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_API_SPACE_ID}`,
  {
    headers: {
      authorization: `Bearer ${process.env.CONTENTFUL_API_KEY}`,
    },
  }
);

export const CMS_ERRORS = {
  unableToFetch: new Error("unable to fetch content from CMS"),
  itemsUndefined: new Error("cms failed to return expected items"),
  metadataNotUnique: new Error(
    "Metadata already defined. Only one metadata field can be present"
  ),
  missingData: (field: string) =>
    new Error(`cms failed to return value for field: ${field}`),
};

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
