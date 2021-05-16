import { ContentfulRichText } from "./contentful-generic";

export type AboutUs = {
  title: string;
  richDescription: ContentfulRichText;
};

export type AboutUsContent = {
  aboutUs: AboutUs;
};
