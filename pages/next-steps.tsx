import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import styled from "@emotion/styled";
import * as React from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import Layout from "../components/Layout";

function NextSteps() {
  return (
    <Layout
      title="Next Steps"
      description="Steps for Reporting Issues"
      showStartButton={true}
    >
      <Box display="flex" justifyContent="left">
        <Box marginTop="16pt" maxWidth="900px">
          <Heading as="h1" size="lg" marginBottom="8pt">
            Steps for Reporting Issues
          </Heading>
          <OrderedList>
            <li>
              <Text>Contact your landlord.</Text>
              <ol style={{ listStyle: "lower-alpha", marginLeft: "16pt" }}>
                <li>
                  <Text>
                    This may be done through your property management
                    company&apos;s housing portal, via email, or other means.
                  </Text>
                </li>
                <li>
                  <Text>
                    We strongly recommend that correspondence with your landlord
                    happen in print (email, letter, etc...), so a record is
                    kept.
                  </Text>
                </li>
                <li>
                  <Text>
                    We advise that you attach your completed housing assessment
                    to the correspondence.
                  </Text>
                </li>
              </ol>
            </li>
            <li>
              <Text>
                If your landlord fails to correct these problems, contact
                Kingston&apos;s Property Standards office at{" "}
                <Link href="tel:613-546-4291" textColor="blue.500">
                  613-546-4291
                </Link>
                , extension{" "}
                <Text as="span" textColor="blue.500">
                  3280
                </Text>{" "}
                or via email at{" "}
                <Link
                  href="mailto:bylawenforcement@cityofkingston.ca"
                  textColor="blue.500"
                >
                  bylawenforcement@cityofkingston.ca
                </Link>
              </Text>
            </li>
            <li>
              <Text>
                If necessary, as deemed by Kingston&apos;s Property Standards
                office, they will set up an inspection within two weeks of you
                contacting them to arrange an inspection of your dwelling.
                (COVID-19 could impact this.)
              </Text>
              <ol style={{ listStyle: "lower-alpha", marginLeft: "16pt" }}>
                <li>
                  <Text>
                    After the inspector confirms these violations, they will
                    issue an order to the landlord to repair these issues within
                    a set time frame.
                  </Text>
                </li>
                <li>
                  <Text>
                    It is your responsibility as a tenant to contact the
                    Property Standards office if these repairs are not
                    completed.
                  </Text>
                </li>
                <li>
                  <Text>
                    If these repairs are not sufficiently completed within the
                    timeline mentioned above, and the landlord does not appeal
                    the order, then the City may take legal action.
                  </Text>
                  <ol style={{ listStyle: "lower-roman", marginLeft: "22pt" }}>
                    <li>
                      <Text>
                        Legal action could entail charges being laid under the
                        Building Code Act against the landlord.
                      </Text>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </OrderedList>
        </Box>
      </Box>
      <NextLink href="/resources">
        <Button
          variant="outline"
          colorScheme="blue"
          marginTop="12pt"
          marginBottom="32pt"
          rightIcon={<ArrowForwardIcon />}
        >
          More Resources
        </Button>
      </NextLink>
    </Layout>
  );
}

const OrderedList = styled.ol`
  margin-left: 12pt;

  li {
    padding: 3pt 0;
  }
`;

export default NextSteps;
