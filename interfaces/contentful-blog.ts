import { ContentfulRichText } from "./contentful-generic";

type BlogItemBase = {
  title: string;
  image: { url: string; alt: string };
  author: string;
  tags: string[];
  date: string;
};

export type BlogItem = BlogPost | BlogExternalLink;

export type BlogPost = BlogItemBase & {
  path: string;
  richDescription: ContentfulRichText;
  seoDescription: string;
};

export type BlogExternalLink = BlogItemBase & {
  externalUrl: string;
};

export type BlogContent = {
  pinnedPosts: BlogItem[];
  recentPosts: BlogItem[];
};
