import { ContentfulRichText } from "./contentful-generic";

type BlogItemBase = {
  id: string;
  title: string;
  image: { url: string; alt: string };
  author: string;
  tags: string[];
  date: string;
  isPinned?: boolean;
  city?: {
    name: string;
    slug: string;
  };
  state?: {
    title: string;
    slug: string;
  };
  country?: {
    title: string;
    slug: string;
  };
};

export type BlogItem = BlogPost | BlogExternalLink;

export type BlogPost = BlogItemBase & {
  path: string;
  richDescription?: ContentfulRichText;
  seoDescription: string;
};

export type BlogExternalLink = BlogItemBase & {
  externalUrl: string;
};

export type BlogContent = {
  pinnedPosts: BlogItem[];
  recentPosts: BlogItem[];
};
