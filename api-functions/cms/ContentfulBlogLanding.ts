import { gql } from "graphql-request";
import {
  BlogItem,
  BlogContent,
  BlogPost,
} from "../../interfaces/contentful-blog";
import {
  GraphQLContentfulAllBlogPostsQuery,
  GraphQLContentfulBlogPostFromPathQuery,
  GraphQLContentfulBlogPostPageQuery,
} from "./codegen/queries";
import {
  checkIfEachPropertyIsDefined,
  client,
  CMS_ERRORS,
} from "./ContentfulUtils";

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
          description
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
          description
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
      const newItem: Partial<BlogItem> & { __typename: string } = {
        __typename: "BlogPost",
        title: item.title,
        image: item.image?.url
          ? {
              url: item.image.url,
              alt: item.image.description ?? "",
            }
          : undefined,
        author: item.author,
        tags: item.tags,
        date: item.sys.firstPublishedAt,
        ...(item.externalUrl
          ? {
              externalUrl: item.externalUrl,
            }
          : {
              path: item.path,
              richDescription: item.richDescription,
              seoDescription: item.seoDescription,
            }),
      };

      if (!checkIfEachPropertyIsDefined(newItem))
        throw CMS_ERRORS.itemsUndefined;

      if (content.pinnedPosts) {
        content.pinnedPosts.push(newItem as BlogItem);
      } else {
        content.pinnedPosts = [newItem as BlogItem];
      }
    }

    for (const item of data.recentPosts.items) {
      if (!item) continue;
      const newItem: Partial<BlogItem> & { __typename: string } = {
        __typename: "BlogPost",
        title: item.title,
        image: item.image?.url
          ? {
              url: item.image.url,
              alt: item.image.description ?? "",
            }
          : undefined,
        author: item.author,
        tags: item.tags,
        date: item.sys.firstPublishedAt,
        ...(item.externalUrl
          ? {
              externalUrl: item.externalUrl,
            }
          : {
              path: item.path,
              richDescription: item.richDescription,
              seoDescription: item.seoDescription,
            }),
      };

      if (!checkIfEachPropertyIsDefined(newItem))
        throw CMS_ERRORS.itemsUndefined;

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

const blogPostAtPathQuery = gql`
  query BlogPostFromPath($path: String) {
    blogPostCollection(where: { path: $path }) {
      items {
        title
        image {
          url
          description
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

export async function fetchBlogPageFromPath(path: string): Promise<BlogPost> {
  try {
    const data = await client.request<GraphQLContentfulBlogPostFromPathQuery>(
      blogPostAtPathQuery,
      { path }
    );
    if (!data) throw CMS_ERRORS.unableToFetch;

    if (
      !data.blogPostCollection?.items ||
      data.blogPostCollection.items.length === 0
    ) {
      throw CMS_ERRORS.unableToFetch;
    }
    const item = data.blogPostCollection.items[0];
    const partialPost: Partial<BlogPost> & { __typename: string } = {
      __typename: "BlogPost",
      title: item.title,
      image: item.image?.url
        ? {
            url: item.image.url,
            alt: item.image.description ?? "",
          }
        : undefined,
      path: item.path,
      author: item.author,
      richDescription: item.richDescription,
      tags: item.tags,
      seoDescription: item.seoDescription,
      date: item.sys.firstPublishedAt,
    };
    if (!checkIfEachPropertyIsDefined(partialPost))
      throw CMS_ERRORS.itemsUndefined;

    return partialPost as BlogPost;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
