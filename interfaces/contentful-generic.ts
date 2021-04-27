import { Document } from "@contentful/rich-text-types";

export type ContentfulRichTextNode = {
  nodeType: string;
  content: ContentfulRichTextNode[];
  marks?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

export type ContentfulRichText = {
  json: Document;
};
