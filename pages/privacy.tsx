import { Box, Heading, Text } from "@chakra-ui/react";
import * as React from "react";
import Layout from "../components/Layout";

function Privacy() {
  return (
    <Layout
      title="Privacy"
      description="Terms of service and data collection policy"
    >
      <Box marginTop="16pt">
        <Heading as="h1" size="lg">
          About us
        </Heading>
        <Box>
          <Text>
            Queen’s Backing Action on Climate Change’s (QBACC) Home Project is
            an initiative created by students for students. As Queen’s students,
            we recognize that we pay an excessive amount for rent while having
            substandard living conditions. Our free home assessment provides you
            with a tool to quickly and easily assess the state of your home and
            ensure that it meets the City of Kingston’s Property Standards.
            Unsurprisingly, many homes are found to be full of violations!
          </Text>
        </Box>
      </Box>
    </Layout>
  );
}

export default Privacy;
