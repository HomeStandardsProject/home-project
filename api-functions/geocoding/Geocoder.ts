export interface Geocoder {
  geocodedSuggestionsFromQueryString: (
    query: string,
    biasLat: number,
    biasLong: number,
    radius: string
  ) => Promise<{ address: string; long: string; lat: string }[] | null>;
}
