import * as React from "react";
import Link from "next/link";
import { Button, Flex, Heading } from "@chakra-ui/core";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="QBACC Home Project">
    <Flex
      justifyContent={"center"}
      minH={`500px`}
      direction="column"
      alignItems={"center"}
      bg={"red"}
    >
      <Heading as="h1" size="xl" textAlign="center">
        Title
      </Heading>
      <Heading as="h2" size="lg" textAlign="center">
        Subtitle
      </Heading>
      <Button marginTop={"20pt"} variantColor="green">
        <Link href="/home-assessment">Start your home assessment</Link>
      </Button>
    </Flex>
  </Layout>
);

export default IndexPage;
