import { ContentfulRichText } from "./contentful-generic";

export type Privacy = {
  title: string;
  richDescription: ContentfulRichText;
};

export type PrivacyContent = {
  privacy: Privacy;
};
