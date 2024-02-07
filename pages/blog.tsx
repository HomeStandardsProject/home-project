import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Stack,
  Text,
  Image,
  Box,
  Heading,
  SimpleGrid,
  Tag,
  IconButton,
  Link,
  Wrap,
  WrapItem,
  Flex,
  Button,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Head from "next/head";
import NextLink from "next/link";

import React from "react";
import { BsFilePost } from "react-icons/bs";

import { fetchBlogPosts } from "../api-functions/cms/ContentfulBlogLanding";
import Layout from "../components/Layout";
import { BlogContent, BlogItem } from "../interfaces/contentful-blog";
import { ContentfulCountry } from "../interfaces/contentful-country";
import { fetchAvailableCountries } from "../api-functions/cms/ContentfulCountries";
import { LocationFilter } from "../components/shared";

type Props = {
  blogContent: BlogContent;
  availableCountries: ContentfulCountry[];
};

function Blog({ blogContent, availableCountries }: Props) {
  const [filteredItems, setFilteredItems] = React.useState(null as any);
  const [selectedParams, setSelectedParams] = React.useState({
    postType: "ALL",
  });

  const filteredTypes = [
    ...blogContent.pinnedPosts,
    ...blogContent.recentPosts,
  ].reduce((acc: any[], { postType }) => {
    if (postType && !acc.find(({ slug }) => slug === postType.slug)) {
      acc.push(postType);
    }

    return acc;
  }, []);

  const filterItems = (items: any[]) => {
    if (!items?.length) return items;
    if (filteredItems === null) return items;
    if (filteredItems.length === 0) return items;

    return items
      .filter(({ id }) => filteredItems?.includes(id))
      .filter(({ postType }) => {
        if (selectedParams.postType === "ALL") return true;
        if (selectedParams.postType === "NONE" && !postType) return true;

        return postType?.slug === selectedParams.postType;
      });
  };

  const items = filterItems([
    ...blogContent.pinnedPosts,
    ...blogContent.recentPosts,
  ]);

  const sortAlphabetically = (items: any[]) => {
    if (!items?.length || items?.length === 1) return items;

    const sortKey = Object.keys(items[0]).find((key) => key === "name")
      ? "name"
      : "title";

    return items.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return -1;
      }
      if (a[sortKey] > b[sortKey]) {
        return 1;
      }
      return 0;
    });
  };

  const handleSelectPostType = (postType: string) => {
    setSelectedParams({ ...selectedParams, postType });
  };

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
        Blog and Research
      </Heading>

      <Box bg="white" p={2}>
        <LocationFilter
          {...{
            filterParams: availableCountries,
            items: [...blogContent.pinnedPosts, ...blogContent.recentPosts].map(
              ({ id, country, state, city }) => ({
                id,
                country: country && country,
                state: state && state,
                city: city && { slug: city.slug, title: city.name },
              })
            ),
            onFilterChange: setFilteredItems,
            styleBox: false,
          }}
        />

        {filteredTypes?.length ? (
          <Flex ml={2}>
            <Heading as="h4" size="sm" mr={2} mt={2}>
              Post Types
            </Heading>
            <Flex wrap="wrap">
              <Button
                color="blue.700"
                fontWeight="400"
                size="sm"
                margin={1}
                {...{
                  ...(selectedParams.postType === "ALL"
                    ? {
                        leftIcon: <CheckIcon />,
                      }
                    : {
                        onClick: () => handleSelectPostType("ALL"),
                      }),
                }}
              >
                All
              </Button>

              <Button
                color="blue.700"
                fontWeight="400"
                size="sm"
                margin={1}
                {...{
                  ...(selectedParams.postType === "NONE"
                    ? {
                        leftIcon: <CheckIcon />,
                      }
                    : {
                        onClick: () => handleSelectPostType("NONE"),
                      }),
                }}
              >
                None
              </Button>

              {sortAlphabetically(filteredTypes).map(({ id, title, slug }) => (
                <Button
                  key={id}
                  color="blue.700"
                  fontWeight="400"
                  size="sm"
                  margin={1}
                  {...{
                    ...(selectedParams.postType === slug
                      ? {
                          leftIcon: <CheckIcon />,
                        }
                      : {
                          onClick: () => handleSelectPostType(slug),
                        }),
                  }}
                >
                  {title}
                </Button>
              ))}
            </Flex>
          </Flex>
        ) : null}
      </Box>

      <SimpleGrid
        columns={{ sm: 1, md: 3 }}
        mt={2}
        spacing={5}
        templateColumns={{ sm: "100%", md: "1fr 1fr 1fr" }}
      >
        {items.map((post) => (
          <Post key={post.title} post={post} isPinned={post.isPinned} />
        ))}
        {/* {blogContent.recentPosts.map((post) => (
          <Post key={post.title} post={post} isPinned={false} />
        ))} */}
      </SimpleGrid>
    </Layout>
  );
}

function Post({ post }: { post: BlogItem; isPinned: boolean }) {
  return (
    <NextLink
      href={"externalUrl" in post ? post.externalUrl : `/blog/${post.path}`}
      passHref
    >
      <Link
        rel={"externalUrl" in post ? "external noopener noreferrer" : undefined}
        target={"externalUrl" in post ? "_blank" : undefined}
      >
        <Box maxW="md" justifySelf="start">
          <Box position="relative">
            <Box position="absolute" right="8pt" top="8pt">
              <IconButton
                isRound
                isActive={false}
                fontSize="18px"
                size="sm"
                icon={
                  "externalUrl" in post ? <ExternalLinkIcon /> : <BsFilePost />
                }
                bg="rgba(247, 250, 252, 0.5)"
                aria-label="Search database"
              />
            </Box>
            <Wrap position="absolute" bottom="8pt" left="8pt" right="8pt">
              {post.tags.map((tag, i) => (
                <WrapItem key={i}>
                  <Tag
                    colorScheme={"blue"}
                    variant="subtle"
                    whiteSpace="nowrap"
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
            {post?.image ? (
              <Image
                borderRadius="lg"
                src={post.image.url}
                alt={post.image.alt}
                width="md"
                objectFit="cover"
                height="400px"
              />
            ) : null}
          </Box>
          <Stack w="100%" spacing={0} py={3}>
            <Heading as="h1" size="md">
              {post.title}
            </Heading>
            <Text>{post.author}</Text>
          </Stack>
        </Box>
      </Link>
    </NextLink>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const blogContent = await fetchBlogPosts();
  const availableCountries = await fetchAvailableCountries();

  return { props: { blogContent, availableCountries }, revalidate: 60 };
};

export default Blog;
