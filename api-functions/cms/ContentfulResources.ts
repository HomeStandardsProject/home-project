import { gql } from "graphql-request";
import {
  isResourceAndContact,
  ResourcesAndContactsContent,
} from "../../interfaces/contentful-resources";
import { GraphQLContentfulResourcesPageContentQuery } from "./codegen/queries";
import { CMS_ERRORS, client, sortByOrder } from "./ContentfulUtils";

const resourcesPageQuery = gql`
  query ResourcesPageContent {
    resourcesAndContactsCollection {
      items {
        sys {
          id
        }
        __typename
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
        city {
          slug
          name
        }
        state {
          slug
          title
        }
        country {
          slug
          title
        }
      }
    }
  }
`;

export async function fetchResources() {
  try {
    const data = await client.request<
      GraphQLContentfulResourcesPageContentQuery
    >(resourcesPageQuery);
    if (!data || !data.resourcesAndContactsCollection)
      throw CMS_ERRORS.unableToFetch;

    const content: Partial<ResourcesAndContactsContent> = {};
    for (const item of data.resourcesAndContactsCollection.items) {
      if (!item) continue;
      if (!isResourceAndContact(item)) continue;

      const {
        sys: { id },
        ...itemData
      } = item;

      if (content.resourcesAndContacts) {
        content.resourcesAndContacts.push({ ...itemData, id });
      } else {
        content.resourcesAndContacts = [{ ...itemData, id }];
      }
    }
    for (const [key, val] of Object.entries(content)) {
      if (!val) throw CMS_ERRORS.missingData(key);
    }
    const sortedContent: ResourcesAndContactsContent = {
      resourcesAndContacts: sortByOrder(content.resourcesAndContacts ?? []),
    };
    return sortedContent;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
