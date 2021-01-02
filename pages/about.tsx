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
            About Us
          </Heading>
          <Stack spacing={4}>
            <Text>
              Queen’s Backing Action on Climate Change ({" "}
              <Link color="green.700" isExternal href="https://www.qbacc.org/">
                QBACC <ExternalLinkIcon mx="2px" />
              </Link>
              ) is proud to debut the Home Project!
            </Text>
            <Text>
              As rental tenants in Kingston, it is no secret that we pay
              excessive rent for substandard living conditions. Rent continues
              to rise yet maintenance and upkeep fall by the wayside. To address
              this, over the past 6 months we have worked to create a free, easy
              to use home assessment tool. With this, you can quickly and easily
              assess the state of your home and ensure that it meets the City of
              Kingston’s Property Standards. Unsurprisingly, many previously
              evaluated homes are found to be full of violations, including
              drafts, unsealed windows, leaky faucets and more
            </Text>
            <Text>
              Taking on average less than 15 minutes, this guided room by room
              assessment asks a series of questions to help you quickly spot
              issues, with all questions cross-referenced with Kingston’s
              mandatory housing standards. Upon completing your assessment, a
              personalized report summarizing your home’s issues will be
              automatically generated. You can send this report directly to your
              landlord or use it to back up maintenance requests with confidence
              that repairs are soon on their way.
            </Text>
            <Box>
              <Text>So, why complete a home assessment?</Text>
              <ul style={{ padding: "0 24pt" }}>
                <li>
                  <Text>
                    Improve your home’s energy efficiency, and in turn, cut down
                    the third largest source of greenhouse gases in Canada
                  </Text>
                </li>
                <li>
                  <Text>Reduce your utilities costs.</Text>
                </li>
                <li>
                  <Text>
                    Improve your living conditions so they are safer and more
                    enjoyable
                  </Text>
                </li>
                <li>
                  <Text>
                    Ensure your landlords are living up to the minimum
                    expectations
                  </Text>
                </li>
                <li>
                  <Text>
                    Give yourself more credibility when approaching your
                    landlords
                  </Text>
                </li>
                <li>
                  <Text>It’s quick & easy to do</Text>
                </li>
                <li>
                  <Text>
                    BONUS: Complete your assessment now, and you can have a free
                    outdoor and/or kitchen-sized green bin delivered to your
                    door
                  </Text>
                </li>
              </ul>
            </Box>
            <Text>
              Be sure to check out the many other unique tools our website has
              to offer, including a RATE YOUR LANDLORD survey, relevant
              articles, facts, and resources to help you with housing disputes.
            </Text>
            <Text>
              We hope that this project can benefit those in the Kingston
              community who find themselves at the mercy of their landlord and
              the asymmetric power relationships that are inherent to this
              relationship. This must change. We believe that every renter
              deserves to have adequate housing and be free from intimidation,
              and hope that this project will serve as a valuable tool for those
              seeking to better their circumstances.
            </Text>
            <Text>
              On behalf of QBACC, we would like to extend a big thank you to
              everyone who has helped make this project possible and to Ricky
              Zhang for his exquisite design expertise.
            </Text>
            <Text>
              If you have any further questions, comments, or concerns, we
              encourage you to reach out to our Home Project Director, Natalie
              Woodland at{" "}
              <Link
                color="green.700"
                isExternal
                href="mailto:queensbacc@gmail.com"
              >
                queensbacc@gmail.com
              </Link>
              .
            </Text>
            <Text>
              Let’s make our living conditions more enjoyable, safer, and
              energy-efficient.
            </Text>
            <Text>Sincerely,</Text>
            <Text>Queen’s Backing Action on Climate Change</Text>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export default About;
