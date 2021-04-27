import { ContentfulRichText } from "./contentful-generic";

export type LandingMetadata = {
  title: string;
  richDescription: ContentfulRichText;
  buttonStartNow: string;
  whyThisToolTitle: string;
  howWeHelpTitle: string;
  kitchenIntro: string;
  didYouKnowTitle: string;
  articleTitle: string;
};

export type LandingExampleViolation = {
  title: string;
  description: string;
  violationReason: string;
  order: number;
  markerLeftPosition: number;
  markerTopPosition: number;
};

export type LandingFact = {
  title: string;
  description: string;
  backgroundImage: { url: string };
  order: number;
  lightTextColor: boolean;
};

export type LandingExplanation = {
  title: string;
  icon: string;
  richDescription: ContentfulRichText;
  order: number;
};

export type DidYouKnow = {
  title: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  order: number;
};
export type RelevantArticle = {
  title: string;
  sourceName: string;
  sourceUrl: string;
  order: number;
  previewImage?: string | null;
};

export type LandingContent = {
  metadata: LandingMetadata;
  violations: LandingExampleViolation[];
  facts: LandingFact[];
  explanations: LandingExplanation[];
  didYouKnows: DidYouKnow[];
  relevantArticles: RelevantArticle[];
};
