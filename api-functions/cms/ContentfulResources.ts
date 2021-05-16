import { gql } from "graphql-request";
import { ResourcesAndContactsContent } from "../../interfaces/contentful-resources";
import { CMS_ERRORS, client, sortByOrder } from "./ContentfulLanding";

const resourcesPageQuery = gql`
  query ResourcesPageContent {
    entryCollection(
      where: {
        contentfulMetadata: { tags: { id_contains_all: ["resources"] } }
      }
    ) {
      items {
        __typename
        ... on ResourcesAndContacts {
          name
          nameUrl
          richDescription: description {
            json
          }
          email
          phoneNumber
          phoneNumberExtension
          facebookName
          facebookUrl
          order
        }
      }
    }
  }
`;

export async function fetchResources() {
  try {
    const data = await client.request(resourcesPageQuery);
    if (!data || !data.entryCollection) throw CMS_ERRORS.unableToFetch;
    const content: Partial<ResourcesAndContactsContent> = {};
    for (const item of data.entryCollection.items) {
      if (!item) continue;
      if (item.__typename === "ResourcesAndContacts") {
        if (content.resourcesAndContacts) {
          content.resourcesAndContacts.push(item);
        } else {
          content.resourcesAndContacts = [item];
        }
      }
    }
    // const requiredContent = content as Required<ResourcesAndContactsContent>;
    const sortedContent: ResourcesAndContactsContent = {
      resourcesAndContacts: sortByOrder(content.resourcesAndContacts),
    };
    return sortedContent;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
