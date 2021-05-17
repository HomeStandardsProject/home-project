import { Box, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import { fetchReporting } from "../api-functions/cms/ContentfulReporting";
import { ReportingContent } from "../interfaces/contentful-reporting";
import { RichContentfulContent } from "../components/RichContentfulContent";

type Props = {
  reportingContent: ReportingContent;
};

function NextSteps({ reportingContent }: Props) {
  const { reporting } = reportingContent;
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
          <RichContentfulContent content={reporting.richDescription} />
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

export const getStaticProps: GetStaticProps = async () => {
  const reportingContent = await fetchReporting();

  return { props: { reportingContent } };
};

export default NextSteps;
