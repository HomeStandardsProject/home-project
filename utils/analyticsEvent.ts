import { Analytics } from "./googleAnalytics";

export function logStartButtonClick() {
  const date = new Date().getUTCSeconds();
  Analytics.event({
    action: "start",
    category: "engagement",
    label: "assessment",
    value: date,
  });
}

export function logGenerateAssessmentButtonClick() {
  const date = new Date().getUTCSeconds();
  Analytics.event({
    action: "generate",
    category: "engagement",
    label: "assessment",
    value: date,
  });
}

export function logDownloadButtonClick() {
  const date = new Date().getUTCSeconds();
  Analytics.event({
    action: "download",
    category: "engagement",
    label: "assessment",
    value: date,
  });
}
