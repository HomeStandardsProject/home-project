import { Box, Heading, Link, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import * as React from "react";
import Layout from "../components/Layout";

function NextSteps() {
  return (
    <Layout
      title="Next Steps"
      description="Process for Reporting Housing Issues"
      showStartButton={true}
    >
      <Box display="flex" justifyContent="left">
        <Box marginTop="16pt" maxWidth="900px">
          <Heading as="h1" size="lg" marginBottom="8pt">
            Process for Reporting Housing Issues
          </Heading>
          <OrderedList>
            <li>
              <Text>Contact your landlord about the problem(s).</Text>
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
                    happens in print (email, letter, etc...), so a record is
                    kept.
                  </Text>
                </li>
              </ol>
            </li>
            <li>
              <Text>
                If your landlord fails to correct these problems, contact
                Kingston&apos;s Property Standards office at 613-546-4291,
                extension 3280 or via email at{" "}
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
              </Text>
            </li>
            <li>
              <Text>
                After the inspector confirms these violations, they will issue
                an Order to the landlord to repair these issues within a set
                time frame.
              </Text>
              <ol style={{ listStyle: "lower-alpha", marginLeft: "16pt" }}>
                <li>
                  <Text>
                    Note, it is your responsibility as a tenant to contact the
                    Property Standards office if these repairs are not
                    completed.
                  </Text>
                </li>
              </ol>
            </li>
            <li>
              <Text>
                If these repairs are not sufficiently completed within the
                timeline mentioned above, and the landlord does not appeal the
                Order, then The City may take Legal action.
              </Text>
            </li>
            <li>
              <Text>
                Legal action could entail charges being laid under the Building
                Code Act against the landlord.
              </Text>
            </li>
          </OrderedList>
        </Box>
      </Box>
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
