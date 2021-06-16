import { gql } from "graphql-request";
import { RichTextPage } from "../../interfaces/contentful-rich-page";
import {
  GraphQLContentfulAllRichTextPagesQuery,
  GraphQLContentfulRichTextPageQuery,
} from "./codegen/queries";
import {
  checkIfEachPropertyIsDefined,
  client,
  CMS_ERRORS,
} from "./ContentfulUtils";

const allRichTextPagesQuery = gql`
  query AllRichTextPages {
    richTextOnlyCollection {
      items {
        __typename
        path
      }
    }
  }
`;

export async function fetchPathsForAllPages(): Promise<string[]> {
  try {
    const data = await client.request<GraphQLContentfulAllRichTextPagesQuery>(
      allRichTextPagesQuery
    );
    if (!data || !data.richTextOnlyCollection) throw CMS_ERRORS.unableToFetch;

    const paths: string[] = [];
    for (const richTextPage of data.richTextOnlyCollection.items) {
      if (!richTextPage.path) continue;
      paths.push(richTextPage.path);
    }
    return paths;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}

const richTextPageQuery = gql`
  query RichTextPage($path: String) {
    richTextOnlyCollection(where: { path: $path }) {
      items {
        __typename
        title
        richDescription: description {
          json
        }
        seoDescription
        showStartButton
      }
    }
  }
`;

export async function fetchPageFromPath(path: string): Promise<RichTextPage> {
  try {
    const data = await client.request<GraphQLContentfulRichTextPageQuery>(
      richTextPageQuery,
      { path }
    );
    if (!data || !data.richTextOnlyCollection) throw CMS_ERRORS.unableToFetch;
    if (!data.richTextOnlyCollection.items) throw CMS_ERRORS.missingData;

    const page = data.richTextOnlyCollection.items[0];
    if (!checkIfEachPropertyIsDefined(page)) throw CMS_ERRORS.itemsUndefined;

    return page as RichTextPage;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
