import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { fetchAvailableCountries } from "../../api-functions/cms/ContentfulCountries";
import Layout from "../../components/Layout";
import { HomeAssessmentDetails } from "../../components/start/details/HomeAssessmentDetails";
import { OverrideAlert } from "../../components/start/details/OverrideAlert";

import { useHomeDetailsApi } from "../../components/start/hooks/useHomeDetailsApi";
import { ContentfulCity } from "../../interfaces/contentful-city";
import {
  ContentfulCountry,
  ContentfulCountryState,
} from "../../interfaces/contentful-country";

import { HomeDetails } from "../../interfaces/home-assessment";

type AssessmentDetailsProps = {
  availableCountries: ContentfulCountry[];
};

function AssessmentDetails({ availableCountries }: AssessmentDetailsProps) {
  const [selectedCity, setSelectedCity] = React.useState<ContentfulCity | null>(
    null
  );
  const [
    selectedCountry,
    setSelectedCountry,
  ] = React.useState<ContentfulCountry | null>(null);
  const [
    selectedState,
    setSelectedState,
  ] = React.useState<ContentfulCountryState | null>(null);
  const { loading, submitHomeDetails } = useHomeDetailsApi();
  const router = useRouter();
  const toast = useToast();

  const availableCities = React.useMemo(() => {
    if (!selectedCountry) {
      return [];
    }

    if (selectedCountry && !selectedCountry.states?.length) {
      return selectedCountry.cities as ContentfulCity[];
    }
    if (!selectedState) {
      return [];
    }

    return selectedState.cities as ContentfulCity[];
  }, [selectedCountry, selectedState]);

  const availableStates = React.useMemo(() => {
    if (!selectedCountry) {
      return [];
    }
    return selectedCountry.states;
  }, [selectedCountry]);

  const handleSelectedCountryChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = event;

      if (!value) return null;

      const matchedCountries = availableCountries.filter(
        (i) => i.title === value
      );
      if (matchedCountries.length === 0) {
        throw new Error("unknown country type");
      }
      setSelectedCountry(matchedCountries[0]);
      setSelectedState(null);
      return setSelectedCity(null);
    },
    [availableCountries]
  );

  const handleSelectedStateChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = event;
      if (!value) return null;
      const matchedStates = availableStates.filter((i) => i.title === value);
      if (matchedStates.length === 0) {
        throw new Error("unknown state type");
      }
      setSelectedState(matchedStates[0]);

      return setSelectedCity(null);
    },
    [availableStates]
  );

  const handleSelectedCityChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = event;
      if (!value) return null;
      const matchedCities = availableCities.filter((i) => i.name === value);
      if (matchedCities.length === 0) {
        throw new Error("unknown city type");
      }

      return setSelectedCity(matchedCities[0]);
    },
    [availableCities]
  );

  const handleSubmitDetails = async (details: HomeDetails) => {
    const { successful, errors } = await submitHomeDetails(details);
    if (successful) {
      router.push("/start/evaluation");
    }

    errors.forEach((error) =>
      toast({
        status: "error",
        description: error.msg,
      })
    );
  };

  const sortAlphabetically = (items: any[]) => {
    if (!items?.length || items.length === 1) return items;

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

  return (
    <Layout
      title="Details"
      description="Free home assessment: see if your Kingston student housing situation is in breach of any housing bylaws."
    >
      <OverrideAlert />
      <Box width="100%" alignItems="center">
        <Stack padding="4pt" marginTop="16pt" maxWidth="800px">
          <Heading
            as="h3"
            size="xs"
            textTransform="uppercase"
            marginBottom="8pt"
          >
            Details
          </Heading>
          <FormControl flexBasis="30%" minW={"265px"} isRequired={true}>
            <FormLabel fontSize="sm">Country</FormLabel>
            <Select
              placeholder="Select country"
              size="md"
              value={selectedCountry?.title ?? ""}
              onChange={handleSelectedCountryChange}
            >
              {sortAlphabetically(availableCountries).map((country) => (
                <option key={country.id} value={country.title}>
                  {country.title}
                </option>
              ))}
            </Select>
          </FormControl>

          {availableStates.length ? (
            <FormControl flexBasis="30%" minW={"265px"} isRequired={true}>
              <FormLabel fontSize="sm">State/Province</FormLabel>
              <Select
                placeholder="Select State/Province"
                size="md"
                value={selectedState?.title ?? ""}
                onChange={handleSelectedStateChange}
              >
                {sortAlphabetically(availableStates).map((state) => (
                  <option key={state.id} value={state.title}>
                    {state.title}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {availableCities?.length ? (
            <FormControl flexBasis="30%" minW={"265px"} isRequired={true}>
              <FormLabel fontSize="sm">City/Law Jurisdiction</FormLabel>
              <Select
                placeholder="Select City/Law Jurisdiction"
                size="md"
                value={selectedCity?.name ?? ""}
                onChange={handleSelectedCityChange}
              >
                {sortAlphabetically(availableCities).map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {selectedCity ? (
            <HomeAssessmentDetails
              selectedCity={selectedCity}
              loading={loading}
              submitDetails={handleSubmitDetails}
            />
          ) : null}
        </Stack>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const availableCountries = await fetchAvailableCountries();

  return { props: { availableCountries }, revalidate: 60 };
};

export default AssessmentDetails;
