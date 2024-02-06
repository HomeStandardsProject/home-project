import { Box, Stack, Image, Heading, Text, Tag } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import * as React from "react";
import {
  fetchBlogPageFromPath,
  fetchPathsForAllBlogPages,
} from "../../api-functions/cms/ContentfulBlogLanding";
import Layout from "../../components/Layout";
import { RichContentfulContent } from "../../components/RichContentfulContent";
import { BlogPost } from "../../interfaces/contentful-blog";

type Props = {
  post: BlogPost;
};

const DynamicPost = ({ post }: Props) => {
  return (
    <Layout title={post.title} description={post.seoDescription}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta name="author" content={post.author} />
      </Head>
      <Box maxWidth="800px" margin="0 auto" marginTop={10} as="article">
        {post?.image ? (
          <Stack isInline align="center">
            <Image
              borderRadius="lg"
              src={post.image.url}
              alt={post.image.alt}
              width="100%"
              objectFit="cover"
              height="200px"
            />
          </Stack>
        ) : null}
        <Stack mt={5}>
          <Stack isInline>
            {post.tags.map((tag, i) => (
              <Tag key={i} colorScheme={"green"} size="sm">
                {tag}
              </Tag>
            ))}
          </Stack>
          <Heading as="h1" size="lg">
            {post.title}
          </Heading>
        </Stack>
        <Box mt={5}>
          <RichContentfulContent content={post?.richDescription} />
        </Box>
        <Stack mt={5}>
          <Text as="b" size="md" color="green.700">
            {post.author}
          </Text>
          <Text as="i">
            Published on{" "}
            {new Intl.DateTimeFormat("en-US").format(new Date(post.date))}
          </Text>
        </Stack>
      </Box>
    </Layout>
  );
};

export async function getStaticPaths() {
  const pages = await fetchPathsForAllBlogPages();

  const paths = pages.map((path) => ({
    params: { path },
  }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.path || typeof params.path !== "string")
    throw new Error("Unable to generate the page. Path does not exist.");

  const page = await fetchBlogPageFromPath(params.path);

  return { props: { post: page }, revalidate: 60 };
};

export default DynamicPost;
