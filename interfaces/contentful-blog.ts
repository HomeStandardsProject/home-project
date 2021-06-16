import { ContentfulRichText } from "./contentful-generic";

export type BlogItem = {
  title?: string;
  image: string;
  author: string;
  tags: string[];
  publishedAt: string;
} & (BlogPost | BlogExternalLink);

export type BlogPost = {
  path: string;
  richDescription: ContentfulRichText;
  seoDescription: string;
};

export type BlogExternalLink = {
  externalUrl: string;
};

export type BlogPostFeed = {
  pinnedPosts: BlogItem[];
  recentPosts: BlogItem[];
};

// export type BlogPostPage = {
//   title: string;
//   image: string;
//   author: string;
//   tags: string[];
//   publishedAt: string;
//   path: string;
//   richDescription: ContentfulRichText;
//   seoDescription: string;
// };
