import { gql } from "graphql-request";
import {
  ContentfulCity,
  ContentfulCityWithRules,
} from "../../interfaces/contentful-city";
import {
  GraphQLContentfulAvailableCitiesQuery,
  GraphQLContentfulAvailableCitiesWithRulesQuery,
} from "./codegen/queries";
import { client, CMS_ERRORS } from "./ContentfulUtils";

const availableCitiesQuery = gql`
  query AvailableCities {
    cityCollection {
      items {
        name
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

export async function fetchAvailableCities(): Promise<ContentfulCity[]> {
  try {
    const data = await client.request<GraphQLContentfulAvailableCitiesQuery>(
      availableCitiesQuery
    );
    if (!data || !data.cityCollection) throw CMS_ERRORS.unableToFetch;
    const cities = Array<Partial<ContentfulCity>>();
    for (const item of data.cityCollection.items) {
      if (!item) continue;
      const landlords = Array<string>();

      for (const landlord of item.landlords?.items ?? []) {
        if ("name" in landlord && typeof landlord.name === "string") {
          landlords.push(landlord.name);
        }
      }

      cities.push({
        name: item.name,
        long: item.biasLong,
        lat: item.biasLat,
        radius: `${item.biasRadius}`,
        landlords,
      });
    }

    for (const [key, val] of Object.entries(cities)) {
      if (!val) throw CMS_ERRORS.missingData(key);
    }

    return cities as Array<ContentfulCity>;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}

const availableCitiesWithRules = gql`
  query AvailableCitiesWithRules {
    cityCollection {
      items {
        name
        questions
        bylawMultiplexer
      }
    }
  }
`;

export async function fetchAvailableCitiesWithRules(): Promise<
  ContentfulCityWithRules[]
> {
  try {
    const data = await client.request<
      GraphQLContentfulAvailableCitiesWithRulesQuery
    >(availableCitiesWithRules);
    if (!data || !data.cityCollection) throw CMS_ERRORS.unableToFetch;
    const cities = Array<Partial<ContentfulCityWithRules>>();
    for (const item of data.cityCollection.items) {
      if (!item) continue;
      cities.push({
        name: item.name,
        questions: item.questions,
        bylawMultiplexer: item.bylawMultiplexer,
      });
    }

    for (const [key, val] of Object.entries(cities)) {
      if (!val) throw CMS_ERRORS.missingData(key);
    }
    return cities as Array<ContentfulCityWithRules>;
  } catch (error) {
    console.error(error);
    throw CMS_ERRORS.unableToFetch;
  }
}
