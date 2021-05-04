import { ContentfulRichText } from "./contentful-generic";

export type ResourcesAndContacts = {
  name: string;
  nameUrl: string;
  richDescription: ContentfulRichText;
  email: string;
  phoneNumber: string;
  phoneNumberExtension: string;
  facebookName: string;
  facebookUrl: string;
  order: number;
};

export type ResourcesAndContactsContent = {
  resourcesAndContacts: ResourcesAndContacts[];
};
