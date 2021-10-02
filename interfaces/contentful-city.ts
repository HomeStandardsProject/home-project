export type ContentfulCity = {
  name: string;
  lat: number;
  long: number;
  radius: string;
};

export type ContentfulCityWithRules = {
  name: string;
  // JSON
  questions: any;
  // JSON
  bylawMultiplexer: any;
};
