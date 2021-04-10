// import Contentful from "contentful"

export const CMS_ERRORS = {
  unableToFetch: new Error("unable to fetch content from CMS"),
  itemsUndefined: new Error("cms failed to return expected items"),
  metadataNotUnique: new Error(
    "Metadata already defined. Only one metadata field can be present"
  ),
  missingData: (field: string) =>
    new Error(`cms failed to return value for field: ${field}`),
};
export type LandingMetadata = {
  title: string;
  description: [];
  buttonStartNow: string;
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
  backgroundImage: [];
  order: number;
};

export type LandingContent = {
  metadata: LandingMetadata;
  violation: LandingExampleViolation[];
  facts: LandingFact[];
};

const url =
  "https://cdn.contentful.com/spaces/56c95v53ajrr/environments/master/entries?access_token=WCe8q5WXL2WA0btELHrTuVAOtSgKXvK7lIFUlYg1Xqo&metadata.tags.sys.id[in]=landing";

type ContentfulResponse = {
  items?: {
    fields: Record<string, unknown>;
    sys: { contentType: { sys: { id: string } } };
  }[];
};

// not handling any errors - add try/catch?
export const fetchLanding = async () => {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as ContentfulResponse;

    const content: Partial<LandingContent> = {};

    if (!data.items) throw CMS_ERRORS.itemsUndefined;

    for (const item of data.items) {
      const itemType = item.sys.contentType.sys.id;
      switch (itemType) {
        case "landingMetadata":
          if (content.metadata) throw CMS_ERRORS.metadataNotUnique;
          content.metadata = item.fields as LandingMetadata;
          break;
        case "offeringExampleViolation": {
          const violation = item.fields as LandingExampleViolation;
          if (!content.violation) {
            content.violation = [violation];
          } else {
            content.violation.push(violation);
          }
          break;
        }
        case "landingFact": {
          const fact = item.fields as LandingFact;
          if (!content.facts) {
            content.facts = [fact];
          } else {
            content.facts.push(fact);
          }
          break;
        }
        default:
          break;
      }
    }

    // check to make sure all of the fields were defined
    for (const [key, val] of Object.entries(content)) {
      if (!val) throw CMS_ERRORS.missingData(key);
    }
    return content as Required<LandingContent>;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
};
