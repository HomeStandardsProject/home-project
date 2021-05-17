import { ContentfulRichText } from "./contentful-generic";

export type RichTextPage = {
  title: string;
  richDescription: ContentfulRichText;
  seoDescription: string;
  showStartButton: boolean;
};
