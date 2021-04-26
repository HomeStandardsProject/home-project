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
  description: string[];
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
  backgroundImage: string;
  order: number;
  lightTextColor: boolean;
};

export type LandingExplanation = {
  title: string;
  description: string;
  hyperlink?: { uri: string; text: string };
  order: number;
};

export type RichElement = {
  nodeType?: string;
  value?: string;
  subRichElements?: SubRichElement[];
  order: number;
};

export type SubRichElement = {
  nodeType: string;
  value: string;
  uri?: string;
};

export type LandingContent = {
  metadata: LandingMetadata;
  violations: LandingExampleViolation[];
  facts: LandingFact[];
  explanations?: RichElement[];
};

const url =
  "https://cdn.contentful.com/spaces/56c95v53ajrr/environments/master/entries?access_token=WCe8q5WXL2WA0btELHrTuVAOtSgKXvK7lIFUlYg1Xqo&metadata.tags.sys.id[in]=landing";

const fetchAsset = async (id: string) => {
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/56c95v53ajrr/environments/master/assets/${id}?access_token=WCe8q5WXL2WA0btELHrTuVAOtSgKXvK7lIFUlYg1Xqo`
    );
    const data = await response.json();
    // return data.fields.file.url;
    const newURL = `https:${data.fields.file.url}`;
    return newURL;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
};

type ContentfulResponse = {
  items?: {
    fields: Record<string, unknown>;
    sys: { contentType: { sys: { id: string } } };
  }[];
};

export const fetchLanding = async () => {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as ContentfulResponse;
    const content: Partial<LandingContent> = {};

    if (!data.items) throw CMS_ERRORS.itemsUndefined;

    for (const item of data.items) {
      const itemType = item.sys.contentType.sys.id;
      switch (itemType) {
        case "landingMetadata": {
          if (content.metadata) throw CMS_ERRORS.metadataNotUnique;
          const description = item.fields.description as {
            content: { content: [{ value: string }] }[];
          };
          content.metadata = {
            title: item.fields.title,
            description: description.content.map(
              (item) => item.content[0].value
            ),
            buttonStartNow: item.fields.buttonStartNow,
            articleTitle: item.fields.articleTitle,
          } as LandingMetadata;
          break;
        }
        case "offeringExampleViolation": {
          const violation = item.fields as LandingExampleViolation;
          if (!content.violations) {
            content.violations = [violation];
          } else {
            content.violations.push(violation);
          }
          content.violations.sort((a, b) => {
            return a.order - b.order;
          });
          break;
        }
        case "landingFact": {
          const backgroundImage = item.fields.backgroundImage as {
            sys: { type: string; linkType: string; id: string };
          };
          const imageURL = await fetchAsset(backgroundImage.sys.id);
          const fact = {
            title: item.fields.title,
            description: item.fields.description,
            backgroundImage: imageURL,
            order: item.fields.order,
            lightTextColor: item.fields.lightTextColor,
          } as LandingFact;
          if (!content.facts) {
            content.facts = [fact];
          } else {
            content.facts.push(fact);
          }
          content.facts.sort((a, b) => {
            return a.order - b.order;
          });
          break;
        }
        case "landingExplanation": {
          const order = item.fields.order as number;
          const info = item.fields.description.content[0].content;
          const subRichElements: SubRichElement[] = [];
          if (info.length > 1) {
            info.forEach((element: any) => {
              if (element.value) {
                const subRichElement = {
                  nodeType: element.nodeType,
                  value: element.value,
                };
                subRichElements.push(subRichElement);
              } else if (element.data.uri) {
                const subRichElement = {
                  nodeType: element.nodeType,
                  value: element.content[0].value,
                  uri: element.data.uri,
                };
                subRichElements.push(subRichElement);
              }
            });
            const richElement = {
              subRichElements: subRichElements as SubRichElement[],
              order: order as number,
            } as RichElement;
            if (content.explanations) {
              content.explanations.push(richElement);
            } else {
              content.explanations = [richElement];
            }
          } else {
            const data = info[0];
            const richElement = {
              nodeType: data.nodeType,
              value: data.value,
              order: order as number,
            } as RichElement;
            if (content.explanations) {
              content.explanations.push(richElement);
            } else {
              content.explanations = [richElement];
            }
          }
          content.explanations.sort((a, b) => {
            return a.order - b.order;
          });
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
