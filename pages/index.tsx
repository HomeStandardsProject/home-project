import * as React from "react";
import Link from "next/link";
import {
  Link as ChakraLink,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AiOutlineSafety } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import Head from "next/head";

import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import { logStartButtonClick } from "../utils/analyticsEvent";
import { Article, loadArticles } from "../utils/loadArticles";
import { fetchLinkPreviewImage } from "../utils/fetchLinkPreviewImage";
import { HomeAssessmentInteractiveExample } from "../components/landing/HomeAssessmentInteractiveExample";
import { useLayoutType } from "../hooks/useLayoutType";

type Props = {
  articles: Article[];
};

function IndexPage({ articles }: Props) {
  const layoutType = useLayoutType();
  const isMobile = layoutType === "mobile";

  return (
    <Layout
      title="QBACC's Home Project"
      description="Does your student housing meet Kingston’s required property standards? Complete your free home assessment."
      showSocialIcons={true}
    >
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Flex
        justifyContent={"center"}
        minH={`500px`}
        direction="column"
        bg={"red"}
        margin={"0 auto"}
        marginTop={"24pt"}
      >
        <Heading
          as="h1"
          size="xl"
          textAlign="left"
          width={isMobile ? "100%" : "80%"}
          fontFamily="Lora, serif"
          fontWeight="500"
          marginBottom="12pt"
        >
          See if your student housing situation is in breach of any housing
          bylaws
        </Heading>
        <Stack>
          <Text textAlign="left">
            Automatically generate a personalized report summarizing your home’s
            issues. This assessment tool guides you through your house room by
            room, asking a series of questions to help you quickly spot issues.
          </Text>
          <Text>
            Let’s make your living conditions more enjoyable, safe, and
            energy-efficient.
          </Text>
        </Stack>
        <Box>
          <Link href="/start">
            <Button
              marginTop={"20pt"}
              colorScheme="green"
              bg="rgba(59, 168, 0, 1.000)"
              boxShadow="md"
              onClick={logStartButtonClick}
            >
              Start now
            </Button>
          </Link>
        </Box>
        <Stack marginTop="50px">
          <Stack isInline align="center" spacing={1}>
            <Icon
              as={AiOutlineSafety}
              color="rgba(59, 168, 0, 1.000)"
              w="24px"
              h="24px"
            />
            <Text fontSize="sm">
              Cross-referenced with{" "}
              <ChakraLink
                href="https://www.cityofkingston.ca/resident/property-standards"
                isExternal
                color="rgba(52, 151, 55, 1.000)"
              >
                Kingston’s mandatory housing standards
              </ChakraLink>
            </Text>
          </Stack>
          <Stack isInline align="center" spacing={1}>
            <Icon
              as={BiSend}
              color="rgba(59, 168, 0, 1.000)"
              w="22px"
              h="22px"
            />
            <Text fontSize="sm">
              You can send the result directly to your landlord or reference it
              when submitting maintenance requests with confidence
            </Text>
          </Stack>
        </Stack>
      </Flex>
      <Box marginTop={isMobile ? "64pt" : 0}>
        <Subheading>Why this tool?</Subheading>
        <Stack isInline={!isMobile} marginTop="16pt">
          <Box
            height="165px"
            backgroundImage={`url("/living-room-card.png")`}
            px="30pt"
            py="20pt"
            borderRadius="lg"
            flexBasis="47.5%"
          >
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              fontWeight="500"
            >
              13% from Homes
            </Heading>
            <Text width="70%">
              Homes and buildings contribute 13% of Canada’s emissions.
            </Text>
          </Box>
          <Box
            height="165px"
            backgroundImage={`url("/night-sky-2-card.png")`}
            px="30pt"
            py="20pt"
            borderRadius="lg"
            flexBasis="52.5%"
          >
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              fontWeight="500"
              color="rgba(255,255,255,0.6)"
            >
              $90M Energy
            </Heading>
            <Text color="white">
              The energy we consume to heat, cool and power our homes represents
              14% of Kingston’s greenhouse gas emissions and cost nearly $90
              million.
            </Text>
          </Box>
        </Stack>
        <Stack isInline={!isMobile} marginTop={2}>
          <Box
            height="165px"
            backgroundImage={`url("/night-sky-1-card.png")`}
            px="30pt"
            py="20pt"
            borderRadius="lg"
            flexBasis="52.5%"
          >
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              fontWeight="500"
              color="rgba(255,255,255,0.6)"
            >
              -30% Emission
            </Heading>
            <Text color="white">
              Kingston is the first Ontario municipality to declare climate
              emergency. The City set a goal to reduce greenhouse gas emissions
              by 30% by the year 2030.
            </Text>
          </Box>
          <Box
            height="165px"
            backgroundImage={`url("/flower-card.png")`}
            px="30pt"
            py="20pt"
            borderRadius="lg"
            flexBasis="47.5%"
          >
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              color="rgba(0,0,0,0.6)"
              fontSize="1.5rem"
              fontWeight="500"
            >
              Our commitment to change
            </Heading>
            <Text>
              GHG emissions such as CO2, are contributing to the current climate
              change crisis. You can help today with our tool by evaluating your
              housing.
            </Text>
          </Box>
        </Stack>
      </Box>
      <Box marginTop="64pt">
        <Subheading>Did you know?</Subheading>
        <Stack isInline={!isMobile} spacing={isMobile ? 6 : 12}>
          <FactContainer title="Erosion">
            <Text>
              Rental rates over the period has been notably higher than the rate
              of inflation over the period illustrating an erosion in housing
              affordability in the local rental market.
            </Text>
            <Box marginTop={isMobile ? "6pt" : "24pt"}>
              <ChakraLink
                color="green.500"
                href="https://www.cityofkingston.ca/documents/10180/33838002/01_2020_Housing_MTFR_Document_AppendixC.pdf/1d5a4054-704f-836f-561a-470d96627fa2?t=1582740336621"
                isExternal
              >
                Kingston Rental Housing Market Analysis Report
              </ChakraLink>
            </Box>
          </FactContainer>
          <FactContainer title="$1998">
            <Text>Average cost of rent in Kingston per month, 2018:</Text>
            <Text>
              Bachelor: $745. One bedroom: $100. Two bedroom: $1200. Three+
              bedroom: $1998.
            </Text>
            <Box marginTop={isMobile ? "6pt" : "42pt"}>
              <ChakraLink
                color="green.500"
                href="https://www.homelesshub.ca/community-profile/kingston"
                isExternal
              >
                Community Profiles - Kingston
              </ChakraLink>
            </Box>
          </FactContainer>
          <FactContainer title="$1998">
            <Text>
              The Ontario Ministry of Municipal Affairs and Housing sets the
              limit every year for how much landlords can legally raise your
              rent that year.
            </Text>
            <Text>
              In 2019, the limit was 1.8%. In 2020, the limit was 2.2%.
            </Text>
            <Box marginTop="6pt">
              <ChakraLink
                color="green.500"
                href="https://settlement.org/ontario/housing/rent-a-home/tenant-rights-and-responsibilities/how-often-can-a-landlord-increase-the-rent"
                isExternal
              >
                How often can a landlord increase the rent?
              </ChakraLink>
            </Box>
          </FactContainer>
        </Stack>
      </Box>
      <Box marginTop="64pt">
        <Subheading>How we help</Subheading>
        <HomeAssessmentInteractiveExample />
      </Box>
      <Box marginTop="64pt">
        <Box
          bg="rgba(48, 132, 51, 1.000)"
          backgroundImage={`url("rate-landlord-banner.png")`}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          backgroundPosition="center center"
          borderRadius="lg"
          padding="28px"
          boxShadow="lg"
        >
          <Stack>
            <Heading
              as="h2"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              color="white"
              fontWeight="500"
            >
              Rate Your Landlord Anonymously
            </Heading>
            <Text color="white">
              We together can recommend the best options to people looking for a
              place to live.
            </Text>
            <Box>
              <ChakraLink href="https://www.google.com/" isExternal>
                <Button
                  variant="outline"
                  colorScheme="white"
                  color="white"
                  marginTop="8pt"
                  size="sm"
                >
                  Rate now
                </Button>
              </ChakraLink>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Box marginTop="64pt">
        <Subheading>Relevant Articles</Subheading>
        <Stack isInline={!isMobile} py="16pt" spacing={4}>
          {articles.map((article, i) => (
            <RelevantArticle key={i} article={article} />
          ))}
        </Stack>
      </Box>
    </Layout>
  );
}

const Subheading: React.FC = ({ children }) => (
  <Heading as="h2" fontFamily="Lora, serif" fontSize="1.6rem" fontWeight="500">
    {children}
  </Heading>
);

const FactContainer: React.FC<{ title: string }> = ({ children, title }) => (
  <Box flexBasis="33.3%">
    <Heading
      as="h3"
      fontFamily="Lora, serif"
      fontSize="1.5rem"
      fontWeight="500"
      color="rgba(0,0,0,0.5)"
    >
      {title}
    </Heading>
    {children}
  </Box>
);

const RelevantArticle: React.FC<{
  article: Article;
}> = ({ article }) => (
  <ChakraLink href={article.sourceUrl} isExternal>
    <Box
      maxWidth="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      height="100%"
    >
      <Box
        minHeight="140px"
        width="100%"
        bg="red.600"
        backgroundImage={`url("${
          article.previewImage ?? `/fallback-article-preview.png`
        }")`}
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center center"
      ></Box>
      <Box padding="4">
        <Text marginTop="1" fontWeight="semibold" as="h4" lineHeight="tight">
          {article.title}
        </Text>
        <Text color="green.400">{article.source}</Text>
      </Box>
    </Box>
  </ChakraLink>
);

export const getStaticProps: GetStaticProps = async () => {
  const articles = loadArticles();

  for (const article of articles) {
    const previewImage = await fetchLinkPreviewImage(article.sourceUrl);
    article.previewImage = previewImage;
  }

  return { props: { articles } };
};

export default IndexPage;
