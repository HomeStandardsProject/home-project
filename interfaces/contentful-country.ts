import { ContentfulCity } from './contentful-city';

export type ContentfulCountryState = {
  id: string;
  title: string;
  cities: ContentfulCity[];
};

export type ContentfulCountry = {
  id: string;
  title: string;
  states: ContentfulCountryState[]
  cities: ContentfulCity[];
};

