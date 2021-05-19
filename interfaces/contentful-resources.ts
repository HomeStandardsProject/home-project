import { ContentfulRichText } from "./contentful-generic";

export type ResourcesAndContacts = {
  name: string;
  nameUrl: string;
  richDescription: ContentfulRichText;
  email?: string;
  phoneNumber?: string;
  phoneNumberExtension?: string;
  facebookName?: string;
  facebookUrl?: string;
  order: number;
};

export function isResourceAndContact(
  object: Record<string, unknown>
): object is ResourcesAndContacts {
  return (
    typeof object.name === "string" &&
    typeof object.nameUrl === "string" &&
    typeof object.richDescription === "object" &&
    typeof object.order === "number"
  );
}

export type ResourcesAndContactsContent = {
  resourcesAndContacts: ResourcesAndContacts[];
};
