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
  SimpleGrid,
} from "@chakra-ui/react";
import { AiOutlineSafety } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { FaRunning } from "react-icons/fa";
import Head from "next/head";

import { GetStaticProps } from "next";

import Layout from "../components/Layout";
import { logStartButtonClick } from "../utils/analyticsEvent";
import { Article, loadArticles } from "../utils/loadArticles";
import { fetchLinkPreviewImage } from "../utils/fetchLinkPreviewImage";
import { HomeAssessmentInteractiveExample } from "../components/landing/HomeAssessmentInteractiveExample";
import { RelevantArticle } from "../components/landing/RelevantArticle";

type Props = {
  articles: Article[];
};

function IndexPage({ articles }: Props) {
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
        minH={`450px`}
        direction="column"
        bg={"red"}
        margin={"0 auto"}
        marginTop={{ sm: "32pt", md: 0 }}
      >
        <Heading
          as="h1"
          size="xl"
          textAlign="left"
          fontFamily="Lora, serif"
          fontWeight="500"
          marginBottom="12pt"
        >
          Is your Kingston housing in violation of any bylaws?
        </Heading>
        <Stack width={{ sm: "100%", md: "80%" }} userSelect="none">
          <Text textAlign="left">
            Automatically generate a personalized report summarizing your home’s
            issues. This assessment tool guides you through your house room by
            room, asking a series of questions to help you quickly and easily
            spot issues.
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
        <Stack marginTop="30pt">
          <Stack isInline align="center" spacing={1}>
            <Icon
              as={FaRunning}
              color="rgba(59, 168, 0, 1.000)"
              w="22px"
              h="22px"
            />
            <Text fontSize="sm">
              Complete your assessment in less than 15 minutes
            </Text>
          </Stack>
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
      <Box marginTop={{ sm: "64pt", md: 0 }}>
        <Subheading>Why this tool?</Subheading>
        <SimpleGrid columns={{ md: 1, lg: 2 }} spacing={2} marginTop="16pt">
          <Box
            height="165px"
            backgroundImage={`url("/living-room-card.png")`}
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="center center"
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
              Buildings account for 13% of Canada&apos;s overall greenhouse gas
              emission.
            </Text>
          </Box>
          <Box
            height="165px"
            backgroundImage={`url("/night-sky-2-card.png")`}
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="center center"
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
        </SimpleGrid>
        <SimpleGrid columns={{ md: 1, lg: 2 }} spacing={2} marginTop={2}>
          <Box
            height="165px"
            backgroundImage={`url("/night-sky-1-card.png")`}
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="center center"
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
              Kingston was the first Ontario municipality to declare a climate
              emergency, setting a goal to cut greenhouse gas emissions by 30%
              by the year 2030.
            </Text>
          </Box>
          <Box
            height="165px"
            backgroundImage={`url("/flower-card.png")`}
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="center center"
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
              crisis. You can help minimize your climate impact by evaluating
              your house.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
      <Box marginTop="64pt">
        <Subheading>How we help</Subheading>
        <Text width="100%">
          Check out this rental property’s kitchen. At first glance, it may
          appear to be in good condition, but multiple bylaw violations can be
          found upon closer inspection.
        </Text>
        <HomeAssessmentInteractiveExample />
      </Box>
      <Box marginTop="64pt">
        <Subheading>Did you know?</Subheading>
        <SimpleGrid
          columns={{ sm: 1, md: 3 }}
          spacing={{ sm: 6, md: 12 }}
          marginTop={2}
        >
          <FactContainer title="Kingston's Skyrocketing Rent">
            <Text>
              Rental rates over the period has been notably higher than the rate
              of inflation over the period illustrating an erosion in housing
              affordability in the local rental market.
            </Text>
            <Box marginTop={{ sm: "6pt", md: "24pt" }}>
              <ChakraLink
                color="green.500"
                href="https://www.cityofkingston.ca/documents/10180/33838002/01_2020_Housing_MTFR_Document_AppendixC.pdf/1d5a4054-704f-836f-561a-470d96627fa2?t=1582740336621"
                isExternal
              >
                Kingston Rental Housing Market Analysis Report
              </ChakraLink>
            </Box>
          </FactContainer>
          <FactContainer title="Average Rents">
            <Text>
              Average cost of rent in Kingston per month for 2018 was Bachelor:
              $745. One bedroom: $1000. Two bedrooms: $1200. Three +(space)
              bedrooms: $1998.
            </Text>
            <Box marginTop={{ sm: "6pt", md: "42pt" }}>
              <ChakraLink
                color="green.500"
                href="https://www.homelesshub.ca/community-profile/kingston"
                isExternal
              >
                Community Profiles - Kingston
              </ChakraLink>
            </Box>
          </FactContainer>
          <FactContainer title="Allowable Rent Increase">
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
        </SimpleGrid>
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
              Rate your landlord anonymously
            </Heading>
            <Text color="white">
              Together we can determine the best (and worst) places to live.
            </Text>
            <Box>
              <ChakraLink
                href="https://docs.google.com/forms/d/e/1FAIpQLSd8vaWsAFvZQANtaEC0AryfBswk5RP2N-1mr9zl0FA4bFh8yQ/viewform?usp=sf_link"
                isExternal
              >
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
        <Subheading>Relevant articles</Subheading>
        <SimpleGrid columns={{ sm: 1, md: 4 }} spacing={4} py="16pt">
          {articles.map((article, i) => (
            <RelevantArticle key={i} article={article} />
          ))}
        </SimpleGrid>
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
  <Stack flexBasis="33.3%">
    <Heading
      as="h3"
      fontFamily="Lora, serif"
      fontSize="1.5rem"
      fontWeight="500"
      color="rgba(0,0,0,0.6)"
      lineHeight="1.5rem"
    >
      {title}
    </Heading>
    {children}
  </Stack>
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
