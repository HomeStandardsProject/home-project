import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import Layout from "../components/Layout";

function About() {
  return (
    <Layout
      title="About"
      description="Terms of service and data collection policy"
      showStartButton={true}
    >
      <Box display="flex">
        <Box marginTop="16pt" maxWidth="900px">
          <Heading as="h1" size="lg" marginBottom="8pt">
            About
          </Heading>
          <Stack spacing="8pt">
            <Text>
              As rental tenants in Kingston, we recognize that we pay excessive
              rent while having substandard living conditions. To fix this,
              Queen’s Backing Action on Climate Change’s (
              <Link color="green.700" isExternal href="https://www.qbacc.org/">
                QBACC <ExternalLinkIcon mx="2px" />
              </Link>
              ) is proud to debut the Home Project! Our free home assessment
              provides you with a tool to quickly and easily assess the state of
              your home and ensure that it meets the City of Kingston’s Property
              Standards. Upon completing your assessment, a personalized report
              summarizing your home’s issues will be automatically generated.
              Unsurprisingly, many homes are found to be full of violations!
            </Text>
            <Text>So, why should I complete a home assessment?</Text>
            <ul style={{ padding: "0 24pt" }}>
              <li>
                <Text>
                  Improve your energy usage, and in turn, help the planet.
                </Text>
              </li>
              <li>
                <Text>Reduce your utilities costs.</Text>
              </li>
              <li>
                <Text>
                  Improve your living conditions so they are safer and more
                  enjoyable.
                </Text>
              </li>
              <li>
                <Text>
                  Ensure your landlords are living up to the minimum
                  expectations.
                </Text>
              </li>
              <li>
                <Text>
                  Give yourself more credibility when approaching your
                  landlords. It’s quick and easy to do.
                </Text>
              </li>
              <li>
                <Text>
                  BONUS: Complete your assessment now, and you can have a free
                  outdoor and/or kitchen-sized green bin delivered to your door
                </Text>
              </li>
            </ul>
            <Text>
              Be sure to check out the many other unique tools our website has
              to offer, including an anonymous Rate Your Landlord survey,
              relevant articles, facts, and resources to help you with housing
              disputes.
            </Text>
            <Text>
              If you have any further questions, comments, or concerns, we
              encourage you to reach out to the Home Project Director Natalie
              Woodland at{" "}
              <Link href="mailto:queensbacc@gmail.com" color="green.600">
                queensbacc@gmail.com
              </Link>
              .
            </Text>
            <Text>
              Let’s make our living conditions more enjoyable, safer, and
              energy-efficient.
            </Text>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export default About;
