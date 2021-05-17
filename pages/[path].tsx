import { Box, Heading, Stack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import * as React from "react";

import {
  fetchPageFromPath,
  fetchPathsForAllPages,
} from "../api-functions/cms/ContentfulRichTextPage";
import Layout from "../components/Layout";
import { RichContentfulContent } from "../components/RichContentfulContent";
import { RichTextPage } from "../interfaces/contentful-rich-page";

type Props = {
  content: RichTextPage;
};

function DynamicPage({ content }: Props) {
  return (
    <Layout
      title={content.title}
      description={content.seoDescription}
      showStartButton={content.showStartButton}
    >
      <Head>
        {/* Less than optimal. Easiest way to get the formating right for indented ordered lists */}
        <style>
          {`
          ol ol {
            list-style: lower-alpha
          }
        `}
        </style>
      </Head>
      <Box display="flex">
        <Box marginTop="16pt" maxWidth="900px">
          <Heading as="h1" size="lg" marginBottom="8pt">
            {content.title}
          </Heading>
          <Stack spacing={4}>
            <RichContentfulContent content={content.richDescription} />
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  const pages = await fetchPathsForAllPages();

  const paths = pages.map((path) => ({
    params: { path },
  }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.path || typeof params.path !== "string")
    throw new Error("Unable to generate the page. Path does not exist.");

  const page = await fetchPageFromPath(params.path);

  return { props: { content: page } };
};

export default DynamicPage;
