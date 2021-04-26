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
  useToast,
} from "@chakra-ui/react";
import { AiOutlineSafety } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { FaRunning } from "react-icons/fa";
import Head from "next/head";

import { GetStaticProps } from "next";

import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { logStartButtonClick } from "../utils/analyticsEvent";
import { Article, loadArticles } from "../utils/loadArticles";
import { fetchLinkPreviewImage } from "../utils/fetchLinkPreviewImage";
import { HomeAssessmentInteractiveExample } from "../components/landing/HomeAssessmentInteractiveExample";
import { RelevantArticle } from "../components/landing/RelevantArticle";
import { AlertMetadata, parseQueryForAlert } from "../utils/parseQueryForAlert";
import { fetchLanding, LandingContent } from "../api-functions/CMS/Contentful";

type Props = {
  articles: Article[];
  landingContent: LandingContent;
};

function IndexPage({ articles, landingContent }: Props) {
  const { query } = useRouter();
  const toast = useToast();
  const { metadata, violations, facts, explanations } = landingContent;

  React.useEffect(() => {
    const alertType = parseQueryForAlert(query);
    if (alertType) {
      toast({ position: "top-right", ...AlertMetadata[alertType] });
    }
  }, [toast, query]);

  return (
    <Layout
      title="Home Standards Project"
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
        marginTop={{ base: "32pt", md: 0 }}
      >
        <Heading
          as="h1"
          size="xl"
          textAlign="left"
          fontFamily="Lora, serif"
          fontWeight="500"
          marginBottom="12pt"
        >
          {/* Is your Kingston housing in violation of any bylaws? */}
          {metadata.title}
        </Heading>
        <Stack width={{ sm: "100%", md: "80%" }} userSelect="none">
          {/* <Text textAlign="left">
            Automatically generate a personalized report summarizing your home’s
            issues. This assessment tool guides you through your house room by
            room, asking a series of questions to help you quickly and easily
            spot issues.
          </Text>
          <Text>
            Let’s make your living conditions more enjoyable, safe, and
            energy-efficient.
          </Text> */}
          {metadata.description.map((item: string, index: number) => {
            return (
              <Text key={index} textAlign="left">
                {item}
              </Text>
            );
          })}
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
              {/* Start now */}
              {metadata.buttonStartNow}
            </Button>
          </Link>
        </Box>
        <Stack marginTop="30pt">
          {explanations?.map((explanation, index) => {
            if (explanation.subRichElements) {
              explanation.subRichElements.map((element, index) => {
                if (element.nodeType === "hyperlink") {
                  return <a href={element.uri}>{element.value}</a>;
                }
                return <p key={index}>{element.value}</p>;
              });
            }
            return <p key={index}>{explanation.value}</p>;
          })}
          {/* {explanations?.map((explanation) => {
            if (explanation.subRichElements) {
              explanation.subRichElements.map((element) => {
                console.log(element);
                if (element.nodeType === "hyperlink") {
                  return <a href={element.uri}>{element.value}</a>;
                } else {
                  return <p>{element.value}</p>;
              }
              return null;
            });
          })} */}
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
                Kingston’s mandatory Property Standards
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
      <Box mt={{ base: "32pt", md: 0 }}>
        <Subheading>Why this tool?</Subheading>
        <SimpleGrid columns={{ base: 2, lg: 2 }} spacing={2} marginTop="16pt">
          {facts.map((fact, index) => {
            return (
              <EnergyFactContainer
                key={fact.title}
                backgroundImage={fact.backgroundImage}
              >
                <Heading
                  as="h3"
                  fontFamily="Lora, serif"
                  fontSize="1.5rem"
                  fontWeight="500"
                  color={
                    fact.lightTextColor ? "rgba(255,255,255,0.6)" : "black"
                  }
                >
                  {fact.title}
                </Heading>
                <Text
                  width={index === 0 ? "70%" : "100%"}
                  // better way to make width dynamic?
                  color={fact.lightTextColor ? "white" : "black"}
                >
                  {fact.description}
                </Text>
              </EnergyFactContainer>
            );
          })}
        </SimpleGrid>
        {/* <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2} marginTop="16pt">
          <EnergyFactContainer backgroundImage="/living-room-card.png">
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              fontWeight="500"
            >
              13%
            </Heading>
            <Text width="70%">
              Buildings account for 13% of Canada&apos;s overall greenhouse gas
              emissions.
            </Text>
          </EnergyFactContainer>
          <EnergyFactContainer backgroundImage="/night-sky-2-card.png">
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              fontWeight="500"
              color="rgba(255,255,255,0.6)"
            >
              $90M
            </Heading>
            <Text color="white">
              The energy we consume to heat, cool and power our homes represents
              14% of Kingston’s greenhouse gas emissions and cost nearly $90
              million annually.
            </Text>
          </EnergyFactContainer>
        </SimpleGrid>
        <SimpleGrid columns={{ md: 1, lg: 2 }} spacing={2} marginTop={2}>
          <EnergyFactContainer backgroundImage="/night-sky-1-card.png">
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              fontSize="1.5rem"
              fontWeight="500"
              color="rgba(255,255,255,0.6)"
            >
              -30%
            </Heading>
            <Text color="white">
              Kingston was the first Ontario municipality to declare a climate
              emergency, setting a goal to cut greenhouse gas emissions 30% by
              the year 2030.
            </Text>
          </EnergyFactContainer>
          <EnergyFactContainer backgroundImage="/flower-card.png">
            <Heading
              as="h3"
              fontFamily="Lora, serif"
              color="rgba(0,0,0,0.6)"
              fontSize="1.5rem"
              fontWeight="500"
            >
              Committing to change
            </Heading>
            <Text>
              Greenhouse gases such as CO2, which are created from home heating
              systems, are contributing to the current climate crisis. You can
              help minimize your climate impact by evaluating your house to
              eliminate substandard conditions.
            </Text>
          </EnergyFactContainer>
        </SimpleGrid> */}
      </Box>
      <Box marginTop={{ base: "32pt", md: "64pt" }}>
        <Subheading>How we help</Subheading>
        <Text width="100%">
          Check out this rental property’s kitchen. At first glance, it may
          appear to be in good condition, but multiple bylaw violations can be
          found upon closer inspection.
        </Text>
        <HomeAssessmentInteractiveExample violations={violations} />
      </Box>
      <Box marginTop="64pt">
        <Subheading>Did you know?</Subheading>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={{ base: 6, md: 12 }}
          marginTop={2}
        >
          <FactContainer title="Kingston's Skyrocketing Rent">
            <Text>
              Rental rates over the period has been notably higher than the rate
              of inflation over the period illustrating an erosion in housing
              affordability in the local rental market.
            </Text>
            <ChakraLink
              color="green.500"
              href="https://www.cityofkingston.ca/documents/10180/33838002/01_2020_Housing_MTFR_Document_AppendixC.pdf/1d5a4054-704f-836f-561a-470d96627fa2?t=1582740336621"
              isExternal
            >
              Kingston Rental Housing Market Analysis Report
            </ChakraLink>
          </FactContainer>
          <FactContainer title="Average Rent">
            <Text>
              Average cost of rent in Kingston per month for 2018 was Bachelor:
              $745. One bedroom: $1000. Two bedrooms: $1200. Three +(space)
              bedrooms: $1998.
            </Text>
            <ChakraLink
              color="green.500"
              href="https://www.homelesshub.ca/community-profile/kingston"
              isExternal
            >
              Community Profiles - Kingston
            </ChakraLink>
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
            <ChakraLink
              color="green.500"
              href="https://settlement.org/ontario/housing/rent-a-home/tenant-rights-and-responsibilities/how-often-can-a-landlord-increase-the-rent"
              isExternal
            >
              How often can a landlord increase the rent?
            </ChakraLink>
          </FactContainer>
        </SimpleGrid>
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

const EnergyFactContainer: React.FC<{ backgroundImage: string }> = ({
  children,
  backgroundImage,
}) => (
  <Box
    minHeight={{ base: "auto", md: "165px" }}
    backgroundImage={`url("${backgroundImage}")`}
    backgroundRepeat="no-repeat"
    backgroundSize="cover"
    backgroundPosition="center center"
    px={{ base: "15pt", sm: "30pt" }}
    py={{ base: "10pt", sm: "20pt" }}
    borderRadius="lg"
    flexBasis="47.5%"
  >
    {children}
  </Box>
);

export const getStaticProps: GetStaticProps = async () => {
  const articles = loadArticles();

  const landingContent = await fetchLanding();

  for (const article of articles) {
    const previewImage = await fetchLinkPreviewImage(article.sourceUrl);
    article.previewImage = previewImage;
  }

  return { props: { articles, landingContent } };
};

export default IndexPage;
