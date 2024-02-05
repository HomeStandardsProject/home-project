import { ContentfulCity } from "./contentful-city";

export type ContentfulCountryState = {
  id: string;
  title: string;
  slug: string;
  cities: ContentfulCity[];
};

export type ContentfulCountry = {
  id: string;
  title: string;
  slug: string;
  states: ContentfulCountryState[];
  cities: ContentfulCity[];
};
