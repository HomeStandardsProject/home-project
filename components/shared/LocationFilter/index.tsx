import React, { useCallback, useEffect, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
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

  const filteredCountries = filterParams.filter((country) => {
    return Object.values(groupedCities).some((city) => {
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

        if (cities.length) {
          return [...acc, state];
        }

        return acc;
      }, [] as ContentfulCountryState[]) || [];

  const filteredCities = filteredStates?.reduce(
    (acc: ContentfulCity[], state) => {
      const cities = state.cities.filter(({ slug }) =>
        Object.keys(groupedCities).includes(slug)
      );

      if (!cities?.length) {
        return acc;
      }

      return [...acc, ...cities];
    },
    [] as ContentfulCity[]
  );

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

        if (params.city !== "ALL" && city?.slug !== params.city) {
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
        <Flex wrap="wrap" align="center" m={2}>
          <Heading as="h4" size="sm" mr={2}>
            Country:
          </Heading>
          <ButtonGroup spacing={2}>
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
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
          </ButtonGroup>
        </Flex>
      ) : null}

      {filteredStates?.length ? (
        <Flex wrap="wrap" align="center" m={2}>
          <Heading as="h4" size="sm" mr={2}>
            State:
          </Heading>
          <ButtonGroup spacing={2}>
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
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
          </ButtonGroup>
        </Flex>
      ) : null}

      {filteredCities?.length ? (
        <Flex wrap="wrap" align="center" m={2}>
          <Heading as="h4" size="sm" mr={2}>
            City
          </Heading>
          <ButtonGroup spacing={2}>
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
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

            {sortAlphabetically(filteredCities).map(({ id, name, slug }) => (
              <Button
                key={id}
                color="blue.700"
                fontWeight="400"
                size="sm"
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
          </ButtonGroup>
        </Flex>
      ) : null}
    </Box>
  );
}
