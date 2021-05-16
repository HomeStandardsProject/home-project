import { Box, Heading, Stack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import * as React from "react";
import { fetchPrivacy } from "../api-functions/cms/ContentfulPrivacy";
import Layout from "../components/Layout";
import { RichContentfulContent } from "../components/RichContentfulContent";
import { PrivacyContent } from "../interfaces/contentful-privacy";

type Props = {
  privacyContent: PrivacyContent;
};

function Privacy({ privacyContent }: Props) {
  const { privacy } = privacyContent;
  return (
    <Layout
      title="Privacy"
      description="Terms of service and data collection policy"
      showStartButton={true}
    >
      <Box marginTop="16pt" maxWidth="900px">
        <Box marginTop="16pt">
          <Heading as="h1" size="lg">
            Terms of Service
          </Heading>
          <Stack>
            <RichContentfulContent content={privacy.richDescription} />
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const privacyContent = await fetchPrivacy();

  return { props: { privacyContent } };
};

export default Privacy;
