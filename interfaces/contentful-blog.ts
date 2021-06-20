import { ContentfulRichText } from "./contentful-generic";

export type BlogItem = {
  title: string;
  image: string;
  author: string;
  tags: string[];
  date: string;
} & (BlogPost | BlogExternalLink);

export type BlogPost = {
  path: string;
  richDescription: ContentfulRichText;
  seoDescription: string;
};

export type BlogExternalLink = {
  externalUrl: string;
};

export type BlogContent = {
  pinnedPosts: BlogItem[];
  recentPosts: BlogItem[];
};
