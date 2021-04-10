// import Contentful from "contentful"

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

const url =
  "https://cdn.contentful.com/spaces/56c95v53ajrr/environments/master/entries?access_token=WCe8q5WXL2WA0btELHrTuVAOtSgKXvK7lIFUlYg1Xqo&metadata.tags.sys.id[in]=landing";

// not handling any errors - add try/catch?
export const fetchLanding = async () => {
  const response = await fetch(url);
  const data = await response.json();
  //   console.log(data);
  const mappedContent = data.items.map((item: any) => {
    const content = item.sys.contentType.sys.id;
    switch (content) {
      case "landingMetadata":
        return item.fields as LandingMetadata;
      case "offeringExampleViolation":
        return content as LandingExampleViolation;
      case "landingFact":
        return content as LandingFact;
      default:
        return null;
    }
  });
  return mappedContent;
};
