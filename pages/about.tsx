import { Box, Heading, Stack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import * as React from "react";
import { fetchAboutUs } from "../api-functions/cms/ContentfulAboutUs";
import Layout from "../components/Layout";
import { RichContentfulContent } from "../components/RichContentfulContent";
import { AboutUsContent } from "../interfaces/contentful-about";

type Props = {
  aboutUsContent: AboutUsContent;
};

function About({ aboutUsContent }: Props) {
  const { aboutUs } = aboutUsContent;
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
            <RichContentfulContent content={aboutUs.richDescription} />
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const aboutUsContent = await fetchAboutUs();

  return { props: { aboutUsContent } };
};

export default About;
