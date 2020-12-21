import * as React from "react";
import Link from "next/link";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { logStartButtonClick } from "../utils/analyticsEvent";

function IndexPage() {
  return (
    <Layout
      title="QBACC's Home Project"
      description="Does your student housing meet Kingston’s required property standards? Complete your free home assessment."
    >
      <Flex
        justifyContent={"center"}
        minH={`500px`}
        width={`80%`}
        direction="column"
        bg={"red"}
        margin={"0 auto"}
      >
        <Heading as="h1" size="xl" textAlign="left" width="80%">
          Start your free home assessment
        </Heading>
        <Text textAlign="left">
          See if your student housing situation is in breach of any housing
          bylaws.
        </Text>
        <Box>
          <Link href="/start">
            <Button
              marginTop={"20pt"}
              colorScheme="green"
              onClick={logStartButtonClick}
            >
              Start now
            </Button>
          </Link>
        </Box>
      </Flex>
    </Layout>
  );
}

export default IndexPage;
