const VALID_ALERT_OPTIONS = ["donationError", "donationSuccess"] as const;
export type AlertOption = typeof VALID_ALERT_OPTIONS[number];

function isAlertOption(value: string): value is AlertOption {
  return VALID_ALERT_OPTIONS.includes(value as AlertOption);
}

export function parseQueryForAlert(query: {
  [key: string]: string | string[];
}): AlertOption | null {
  if ("alert" in query && typeof query.alert === "string") {
    return isAlertOption(query.alert) ? query.alert : null;
  }
  return null;
}

export const AlertMetadata: {
  [key in AlertOption]: {
    status: "success" | "error";
    title: string;
    description?: string;
  };
} = {
  donationError: {
    status: "error",
    title: "Donation was not processed since it was cancelled",
  },
  donationSuccess: {
    status: "success",
    title: "Donation was successfull",
    description: "Thank you for supporting the Home Standards Project",
  },
};
