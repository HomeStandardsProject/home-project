export type ContentfulCity = {
  id: string;
  name: string;
  lat: number;
  long: number;
  radius: string;
  slug: string;
  landlords: string[];
};

export type ContentfulCityWithRules = {
  name: string;
  // JSON
  questions: any;
  // JSON
  bylawMultiplexer: any;
};
