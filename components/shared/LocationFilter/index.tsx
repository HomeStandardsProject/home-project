import React, { useCallback, useEffect, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import {
  ContentfulCountry,
  ContentfulCountryState,
} from "../../../interfaces/contentful-country";
import { ContentfulCity } from "../../../interfaces/contentful-city";

interface LocationFilterProps {
  filterParams: ContentfulCountry[];
  items: {
    id: string;
    country?: {
      slug: string;
      title: string;
    };
    state?: {
      slug: string;
      title: string;
    };
    city?: {
      slug: string;
      title: string;
    };
  }[];
  onFilterChange?: (items: string[]) => void;
}

export default function LocationFilter(props: LocationFilterProps) {
  const { filterParams, items, onFilterChange } = props;

  const [selectedParams, setSelectedParams] = useState({
    country: "ALL",
    state: "ALL",
    city: "ALL",
  });

  const groupedCities = items.reduce((acc, { city }) => {
    if (!city) {
      return acc;
    }

    return {
      ...acc,
      [city.slug]: city,
    };
  }, {}) as { [key: string]: ContentfulCity };

  const groupedStates = items.reduce((acc, { state }) => {
    if (!state) {
      return acc;
    }

    return {
      ...acc,
      [state.slug]: state,
    };
  }, {}) as { [key: string]: ContentfulCountryState };

  const groupedCountries = items.reduce((acc, { country }) => {
    if (!country) {
      return acc;
    }

    return {
      ...acc,
      [country.slug]: country,
    };
  }, {}) as { [key: string]: ContentfulCountry };

  const filteredCountries = filterParams.filter((country) => {
    const countriesFromCities = Object.values(groupedCities).some((city) => {
      if (
        country?.cities?.length &&
        country?.cities.find(({ slug }) => slug === city.slug)
      ) {
        return true;
      }

      if (country.states) {
        return Object.values(country.states).some((state) => {
          return (
            state.cities.find(({ slug }) => slug === city.slug) !== undefined
          );
        });
      }

      return false;
    });

    const countriesFromItems = groupedCountries[country.slug] !== undefined;

    return countriesFromCities || countriesFromItems;
  });

  const filteredStates =
    filteredCountries
      .find(({ slug }) => slug === selectedParams.country)
      ?.states.reduce((acc: ContentfulCountryState[], state) => {
        const cities = Object.values(groupedCities).filter((city) => {
          return (
            state.cities.find(({ slug }) => slug === city.slug) !== undefined
          );
        });

        if (
          Object.values(groupedStates)
            .map((state) => state.slug)
            .includes(state.slug) &&
          acc.find(({ slug }) => slug === state.slug) === undefined
        ) {
          return [...acc, state];
        }

        if (cities.length) {
          return [...acc, state];
        }

        return acc;
      }, [] as ContentfulCountryState[]) || [];

  const filteredCities = filteredStates
    .filter(({ slug }) => slug === selectedParams.state)
    ?.reduce((acc: ContentfulCity[], state) => {
      const cities = state.cities.filter(({ slug }) =>
        Object.keys(groupedCities).includes(slug)
      );

      if (!cities?.length) {
        return acc;
      }

      return [...acc, ...cities];
    }, [] as ContentfulCity[]);

  const handleOnFilter = (params: {
    country: string;
    state: string;
    city: string;
  }) => {
    const itemsWithStateAndCountry = items.map((item) => {
      const country = filterParams.find(({ cities, states }) => {
        return (
          cities.find(({ slug }) => slug === item?.city?.slug) ||
          states?.find(
            ({ cities }) =>
              cities.find(({ slug }) => slug === item?.city?.slug) ||
              states.find(({ slug }) => slug === item?.state?.slug)
          )
        );
      });

      const state = country?.states?.find(({ cities }) => {
        return cities.find(({ slug }) => slug === item?.city?.slug);
      });

      return {
        ...item,
        ...(!item?.country && {
          country: {
            title: country?.title,
            slug: country?.slug,
          },
        }),
        ...(!item?.state && {
          state: {
            title: state?.title,
            slug: state?.slug,
          },
        }),
      };
    });

    const filteredItems = itemsWithStateAndCountry.filter(
      ({ country, state, city }) => {
        if (params.country !== "ALL" && country?.slug !== params.country) {
          return false;
        }

        if (params.state !== "ALL" && state?.slug !== params.state) {
          return false;
        }

        if (
          params.city !== "ALL" &&
          params.city !== "NONE" &&
          city?.slug !== params.city
        ) {
          return false;
        }

        if (params.city === "NONE" && state && city) {
          return false;
        }

        return true;
      }
    );

    if (onFilterChange) {
      onFilterChange(filteredItems.map(({ id }) => id) || []);
    }
  };

  const handleSelectCountry = useCallback((countrySlug) => {
    const upd = {
      country: countrySlug,
      state: "ALL",
      city: "ALL",
    };
    setSelectedParams(upd);

    if (filteredCountries.length > 1) {
      handleOnFilter(upd);
    }
  }, []);

  const handleSelectState = useCallback((stateSlug) => {
    setSelectedParams((params) => {
      const upd = {
        ...params,
        state: stateSlug,
        city: "ALL",
      };

      return upd;
    });
  }, []);

  const handleSelectCity = useCallback((citySlug) => {
    setSelectedParams((params) => {
      const upd = {
        ...params,
        city: citySlug,
        ...(citySlug === "NONE" && { state: "ALL" }),
      };

      return upd;
    });
  }, []);

  const sortAlphabetically = (items: any[]) => {
    if (!items?.length || items?.length === 1) return items;

    const sortKey = Object.keys(items[0]).find((key) => key === "name")
      ? "name"
      : "title";

    return items.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return -1;
      }
      if (a[sortKey] > b[sortKey]) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    handleOnFilter(selectedParams);
  }, [selectedParams]);

  if (!items?.length) return null;

  return (
    <Box bg="white" p={2}>
      {filteredCountries?.length ? (
        <Flex ml={2}>
          <Heading as="h4" size="sm" mr={2} mt={2}>
            Country:
          </Heading>
          <Flex wrap="wrap">
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
              margin={1}
              {...{
                ...(selectedParams.country === "ALL"
                  ? {
                      leftIcon: <CheckIcon />,
                    }
                  : {
                      onClick: () => handleSelectCountry("ALL"),
                    }),
              }}
            >
              All
            </Button>

            {sortAlphabetically(filteredCountries).map(
              ({ id, title, slug }) => (
                <Button
                  key={id}
                  color="blue.700"
                  fontWeight="400"
                  size="sm"
                  margin={1}
                  {...{
                    ...(selectedParams.country === slug
                      ? {
                          leftIcon: <CheckIcon />,
                        }
                      : {
                          onClick: () => handleSelectCountry(slug),
                        }),
                  }}
                >
                  {title}
                </Button>
              )
            )}
          </Flex>
        </Flex>
      ) : null}

      {filteredStates?.length ? (
        <Flex ml={2}>
          <Heading as="h4" size="sm" mr={2} mt={2}>
            State/Province:
          </Heading>
          <Flex wrap="wrap">
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
              margin={1}
              {...{
                ...(selectedParams.state === "ALL"
                  ? {
                      leftIcon: <CheckIcon />,
                    }
                  : {
                      onClick: () => handleSelectState("ALL"),
                    }),
              }}
            >
              All
            </Button>

            {sortAlphabetically(filteredStates).map(({ id, title, slug }) => (
              <Button
                key={id}
                color="blue.700"
                fontWeight="400"
                size="sm"
                margin={1}
                {...{
                  ...(selectedParams.state === slug
                    ? {
                        leftIcon: <CheckIcon />,
                      }
                    : {
                        onClick: () => handleSelectState(slug),
                      }),
                }}
              >
                {title}
              </Button>
            ))}
          </Flex>
        </Flex>
      ) : null}

      {filteredCities?.length ? (
        <Flex ml={2}>
          <Heading as="h4" size="sm" mr={2} mt={2}>
            City
          </Heading>
          <Flex wrap="wrap">
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
              margin={1}
              {...{
                ...(selectedParams.city === "ALL"
                  ? {
                      leftIcon: <CheckIcon />,
                    }
                  : {
                      onClick: () => handleSelectCity("ALL"),
                    }),
              }}
            >
              All
            </Button>

            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
              margin={1}
              {...{
                ...(selectedParams.city === "NONE"
                  ? {
                      leftIcon: <CheckIcon />,
                    }
                  : {
                      onClick: () => handleSelectCity("NONE"),
                    }),
              }}
            >
              State/Province wide
            </Button>

            {sortAlphabetically(filteredCities).map(({ id, name, slug }) => (
              <Button
                key={id}
                color="blue.700"
                fontWeight="400"
                size="sm"
                margin={1}
                {...{
                  ...(selectedParams.city === slug
                    ? {
                        leftIcon: <CheckIcon />,
                      }
                    : {
                        onClick: () => handleSelectCity(slug),
                      }),
                }}
              >
                {name}
              </Button>
            ))}
          </Flex>
        </Flex>
      ) : null}
    </Box>
  );
}
