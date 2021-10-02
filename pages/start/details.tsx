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
import { fetchAvailableCities } from "../../api-functions/cms/ContentfulCities";
import Layout from "../../components/Layout";
import { HomeAssessmentDetails } from "../../components/start/details/HomeAssessmentDetails";
import { OverrideAlert } from "../../components/start/details/OverrideAlert";

import { useHomeDetailsApi } from "../../components/start/hooks/useHomeDetailsApi";
import { ContentfulCity } from "../../interfaces/contentful-city";

import { HomeDetails } from "../../interfaces/home-assessment";

type AssessmentDetailsProps = {
  availableCities: ContentfulCity[];
};

function AssessmentDetails({ availableCities }: AssessmentDetailsProps) {
  const [selectedCity, setSelectedCity] = React.useState<ContentfulCity | null>(
    null
  );
  const { loading, submitHomeDetails } = useHomeDetailsApi();
  const router = useRouter();
  const toast = useToast();

  const handleSelectedCityChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = event;
      const matchedCities = availableCities.filter((i) => i.name === value);
      if (matchedCities.length === 0) {
        throw new Error("unknown city type");
      }
      setSelectedCity(matchedCities[0]);
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
            <FormLabel fontSize="sm">City</FormLabel>
            <Select
              placeholder="Select city"
              size="md"
              value={selectedCity?.name ?? ""}
              onChange={handleSelectedCityChange}
            >
              {availableCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Select>
          </FormControl>

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
  const availableCities = await fetchAvailableCities();

  return { props: { availableCities }, revalidate: 60 };
};

export default AssessmentDetails;
