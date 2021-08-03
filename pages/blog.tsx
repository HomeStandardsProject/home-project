import {
  Stack,
  Text,
  Image,
  Box,
  Heading,
  SimpleGrid,
  Tag,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";

import React from "react";
import { fetchBlogPosts } from "../api-functions/cms/ContentfulBlogLanding";
import Layout from "../components/Layout";
import { BlogContent } from "../interfaces/contentful-blog";

type Props = {
  blogContent: BlogContent;
};

function Blog({ blogContent }: Props) {
  return (
    <Layout
      title="Blog Landing"
      description="Blog landing with pinned and recent posts"
      showStartButton={true}
    >
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Heading
        mt={10}
        fontFamily="Lora, serif"
        fontSize="1.6rem"
        fontWeight="500"
      >
        Featured Posts
      </Heading>
      <SimpleGrid
        columns={{ sm: 1, md: 2 }}
        mt={2}
        spacing={5}
        templateColumns={{ sm: "100%", md: "repeat(2, minmax(auto, 500px))" }}
      >
        {blogContent.pinnedPosts.map((post, i) => (
          <Box key={i} maxW="md" justifySelf="start">
            <Box position="relative">
              <Stack position="absolute" bottom="8pt" left="8pt" isInline>
                {post.tags.map((tag, i) => (
                  <Tag key={i} colorScheme="green">
                    {tag}
                  </Tag>
                ))}
              </Stack>
              <Image
                borderRadius="lg"
                src={post.image}
                width="md"
                objectFit="cover"
                height="250px"
              />
            </Box>
            <Stack w="100%" spacing={0} py={3}>
              <Heading as="h1" size="md">
                {post.title}
              </Heading>
              <Text>{post.author}</Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
      <Heading
        mt={10}
        fontFamily="Lora, serif"
        fontSize="1.6rem"
        fontWeight="500"
      >
        Recent Posts
      </Heading>
      <SimpleGrid
        columns={{ sm: 1, md: 3 }}
        mt={2}
        spacing={5}
        templateColumns={{ sm: "100%", md: "1fr 1fr 1fr" }}
      >
        {blogContent.recentPosts.map((post, i) => (
          <Box key={i} maxW="md" justifySelf="start">
            <Box position="relative">
              <Stack position="absolute" bottom="8pt" left="8pt" isInline>
                {post.tags.map((tag, i) => (
                  <Tag key={i} colorScheme="green">
                    {tag}
                  </Tag>
                ))}
              </Stack>
              <Image
                borderRadius="lg"
                src={post.image}
                width="md"
                objectFit="cover"
                height="400px"
              />
            </Box>
            <Stack w="100%" spacing={0} py={3}>
              <Heading as="h1" size="md">
                {post.title}
              </Heading>
              <Text>{post.author}</Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const blogContent = await fetchBlogPosts();

  return { props: { blogContent }, revalidate: 60 };
};

export default Blog;
