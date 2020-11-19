import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import Layout from "../components/Layout";

function About() {
  return (
    <Layout
      title="About"
      description="Terms of service and data collection policy"
    >
      <Box display="flex" justifyContent="center">
        <Box marginTop="16pt" maxWidth="900px">
          <Heading as="h1" size="lg" marginBottom="8pt">
            About
          </Heading>
          <Stack spacing="8pt">
            <Text>
              Queen’s Backing Action on Climate Change’s (
              <Link color="green.700" isExternal href="https://www.qbacc.org/">
                QBACC <ExternalLinkIcon mx="2px" />
              </Link>
              ) Home Project is an initiative created by students for students.
              As Queen’s students, we recognize that we pay an excessive amount
              for rent while having substandard living conditions. Our free home
              assessment provides you with a tool to quickly and easily assess
              the state of your home and ensure that it meets the City of
              Kingston’s Property Standards. Unsurprisingly, many homes are
              found to be full of violations!{" "}
            </Text>
            <Text>Why should I complete a home assessment?</Text>
            <ul style={{ padding: "0 24pt" }}>
              <li>
                <Text>Improve your living conditions</Text>
              </li>
              <li>
                <Text>
                  Improve your energy usage, and in turn, help the planet
                </Text>
              </li>
              <li>
                <Text>Reduce your utilities costs</Text>
              </li>
              <li>
                <Text>
                  Ensure your landlords are living up to the minimum
                  expectations
                </Text>
              </li>
              <li>
                <Text>
                  You can provide your landlords with a list of issues that they
                  must take seriously
                </Text>
              </li>
              <li>
                <Text>
                  Help build a data bank of the present violations in student
                  homes, which can be referenced by future tenants to ensure
                  landlords aren’t passing the blame onto them for pre-existing
                  problems
                </Text>
              </li>
            </ul>
            <Text>
              Let’s work together to improve our homes & reduce our footprints
              on the planet!
            </Text>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export default About;
