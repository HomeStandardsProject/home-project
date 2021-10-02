import { Geocoder } from "./Geocoder";

export class MockGeocoder implements Geocoder {
  // eslint-disable-next-line class-methods-use-this
  async geocodedSuggestionsFromQueryString(): Promise<
    {
      address: string;
      long: string;
      lat: string;
    }[]
  > {
    return new Promise((resolve) => {
      resolve([
        {
          address: "Mocked Address Kingston",
          lat: "44.2319459",
          long: "-76.496439299",
        },
        {
          address: "Mocked Address Toronto",
          lat: "44.2319459",
          long: "-76.496439299",
        },
      ]);
    });
  }
}
