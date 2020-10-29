import * as React from "react";
import Link from "next/link";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/core";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="QBACC Home Project">
    <Flex
      justifyContent={"center"}
      minH={`500px`}
      width={`80%`}
      direction="column"
      bg={"red"}
      margin={"0 auto"}
    >
      <Heading as="h1" size="xl" textAlign="left" width="80%">
        Start a free home assessment
      </Heading>
      <Text textAlign="left">
        See if your student housing situation is in breach of any housing
        bylaws.
      </Text>
      <Box>
        <Link href="/home-assessment">
          <Button marginTop={"20pt"} variantColor="green">
            Start now
          </Button>
        </Link>
      </Box>
    </Flex>
  </Layout>
);

export default IndexPage;
