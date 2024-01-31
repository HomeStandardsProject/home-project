export type ContentfulCity = {
  id: string;
  name: string;
  lat: number;
  long: number;
  radius: string;

  landlords: string[];
};

export type ContentfulCityWithRules = {
  name: string;
  // JSON
  questions: any;
  // JSON
  bylawMultiplexer: any;
};
