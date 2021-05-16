import { ContentfulRichText } from "./contentful-generic";

export type Reporting = {
  title: string;
  richDescription: ContentfulRichText;
};

export type ReportingContent = {
  reporting: Reporting;
};
