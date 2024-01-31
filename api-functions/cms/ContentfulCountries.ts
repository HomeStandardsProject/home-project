import { gql } from "graphql-request";
import {
  ContentfulCountry, ContentfulCountryState,
} from "../../interfaces/contentful-country";
import {
  GraphQLContentfulAvailableStatesQuery,
  GraphQLContentfulAvailableCountriesQuery,
  GraphQLContentfulAvailableCitiesQuery,
} from "./codegen/queries";
import { client, CMS_ERRORS } from "./ContentfulUtils";
import { ContentfulCity } from '../../interfaces/contentful-city';

const availableCountriesQuery = gql`
  query AvailableCountries {
    countryCollection(limit: 10) {
      items {
        title
        sys {
          id
        }
        
        states: statesCollection(limit: 50) {
          items {
            title
            sys {
              id
            }
          }
        }

        cities: citiesCollection {
          items {
            name
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

const availableStatesQuery = gql`
  query AvailableStates {
    stateCollection(limit: 50) {
      items {
        title
        sys {
          id
        }

        cities: citiesCollection {
          items {
            name
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

const availableCitiesQuery = gql`
  query AvailableCities {
    cityCollection{
      items {
        name
        sys {
          id
        }

        biasLat
        biasLong
        biasRadius

        landlords: landlordsCollection {
          items {
            ... on Landlord {
              name
            }
          }
        }
      }
    }
  }
`;

export async function fetchAvailableCountries(): Promise<ContentfulCountry[]> {
  try {
    const countriesData = await client.request<GraphQLContentfulAvailableCountriesQuery>(
      availableCountriesQuery
    );
    const statesData = await client.request<GraphQLContentfulAvailableStatesQuery>(
      availableStatesQuery
    );
    const citiesData = await client.request<GraphQLContentfulAvailableCitiesQuery>(
      availableCitiesQuery
    );
    
    if (!countriesData || !countriesData.countryCollection) throw CMS_ERRORS.unableToFetch;
    if (!statesData || !statesData.stateCollection) throw CMS_ERRORS.unableToFetch;
    if (!citiesData || !citiesData.cityCollection) throw CMS_ERRORS.unableToFetch;

    const countries = Array<Partial<ContentfulCountry>>();
    const states = Array<Partial<ContentfulCountryState>>();
    const cities = Array<Partial<ContentfulCity>>();
    
    for (const cityItem of citiesData.cityCollection.items) {
      if (!cityItem) continue;

      const landlords = Array<string>();

      for (const landlord of cityItem.landlords?.items ?? []) {
        if ("name" in landlord && typeof landlord.name === "string") {
          landlords.push(landlord.name);
        }
      }

      cities.push({
        id: cityItem.sys.id,
        name: cityItem.name,
        long: cityItem.biasLong,
        lat: cityItem.biasLat,
        radius: `${cityItem.biasRadius}`,
        landlords,
      });
    }
    
    for (const stateItem of statesData.stateCollection.items) {
      if (!stateItem) continue;

      states.push({
        id: stateItem.sys.id,
        title: stateItem.title,
        cities: stateItem.cities.items.map((city) => cities.find((c) => c.id === city.sys.id) ?? []) as ContentfulCity[],
      });
    }

    for (const item of countriesData.countryCollection.items) {
      if (!item) continue;

      countries.push({
        id: item.sys.id,
        title: item.title,
        states: item.states.items.map((state) => states.find((s) => s.id === state.sys.id) ?? []) as ContentfulCountryState[],
        cities: item.cities.items.map((city) => cities.find((c) => c.id === city.sys.id) ?? []) as ContentfulCity[],
      });
    }

    for (const [key, val] of Object.entries(countries)) {
      if (!val) throw CMS_ERRORS.missingData(key);
    }

    return countries as Array<ContentfulCountry>;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
