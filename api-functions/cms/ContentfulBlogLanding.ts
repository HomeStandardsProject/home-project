import { gql } from "graphql-request";
import { BlogItem, BlogContent } from "../../interfaces/contentful-blog";
import {
  GraphQLContentfulAllBlogPostsQuery,
  GraphQLContentfulBlogPostPageQuery,
} from "./codegen/queries";
import { client, CMS_ERRORS } from "./ContentfulUtils";

const allBlogPostPagesQuery = gql`
  query AllBlogPosts {
    blogPostCollection(where: { path_exists: true }) {
      items {
        __typename
        path
      }
    }
  }
`;

export async function fetchPathsForAllBlogPages(): Promise<string[]> {
  try {
    const data = await client.request<GraphQLContentfulAllBlogPostsQuery>(
      allBlogPostPagesQuery
    );
    if (!data || !data.blogPostCollection) throw CMS_ERRORS.unableToFetch;

    const paths: string[] = [];
    for (const blogPostPage of data.blogPostCollection.items) {
      if (!blogPostPage.path) continue;
      paths.push(blogPostPage.path);
    }

    return paths;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}

const blogPostPageQuery = gql`
  query BlogPostPage {
    pinnedPosts: blogPostCollection(
      where: { pinned: true }
      order: sys_firstPublishedAt_DESC
    ) {
      items {
        title
        image {
          url
        }
        path
        author
        richDescription: description {
          json
        }
        tags
        externalUrl
        seoDescription
        sys {
          firstPublishedAt
        }
      }
    }
    recentPosts: blogPostCollection(
      where: { pinned: false }
      order: sys_firstPublishedAt_DESC
    ) {
      items {
        title
        image {
          url
        }
        path
        author
        richDescription: description {
          json
        }
        tags
        externalUrl
        seoDescription
        sys {
          firstPublishedAt
        }
      }
    }
  }
`;

export const fetchBlogPosts = async () => {
  try {
    const data = await client.request<GraphQLContentfulBlogPostPageQuery>(
      blogPostPageQuery
    );
    if (!data || !data.pinnedPosts || !data.recentPosts)
      throw CMS_ERRORS.unableToFetch;

    const content: Partial<BlogContent> = {};
    for (const item of data.pinnedPosts.items) {
      if (!item) continue;
      const newItem = {
        title: item.title,
        image: item.image?.url,
        path: item.path,
        author: item.author,
        richDescription: item.richDescription,
        tags: item.tags,
        externalUrl: item.externalUrl,
        seoDescription: item.seoDescription,
        date: item.sys.firstPublishedAt,
      };
      if (content.pinnedPosts) {
        content.pinnedPosts.push(newItem as BlogItem);
      } else {
        content.pinnedPosts = [newItem as BlogItem];
      }
    }
    for (const item of data.recentPosts.items) {
      if (!item) continue;
      const newItem = {
        title: item.title,
        image: item.image?.url,
        path: item.path,
        author: item.author,
        richDescription: item.richDescription,
        tags: item.tags,
        externalUrl: item.externalUrl,
        seoDescription: item.seoDescription,
        date: item.sys.firstPublishedAt,
      };
      if (content.recentPosts) {
        content.recentPosts.push(newItem as BlogItem);
      } else {
        content.recentPosts = [newItem as BlogItem];
      }
    }

    return content as BlogContent;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
};

export async function fetchBlogPageFromPath(path: string): Promise<BlogItem> {
  try {
    const data = await client.request<GraphQLContentfulBlogPostPageQuery>(
      blogPostPageQuery,
      { path }
    );
    if (!data) throw CMS_ERRORS.unableToFetch;

    if (!data.pinnedPosts?.items || !data.recentPosts?.items)
      throw CMS_ERRORS.missingData;

    const item = data.pinnedPosts.items[0]
      ? data.pinnedPosts.items[0]
      : data.recentPosts.items[0];

    return {
      title: item.title,
      image: item.image?.url,
      path: item.path,
      author: item.author,
      richDescription: item.richDescription,
      tags: item.tags,
      externalUrl: item.externalUrl,
      seoDescription: item.seoDescription,
      date: item.sys.firstPublishedAt,
    } as BlogItem;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
