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
import { fetchLinkPreviewImage } from "../utils/fetchLinkPreviewImage";
import { HomeAssessmentInteractiveExample } from "../components/landing/HomeAssessmentInteractiveExample";
import { AlertMetadata, parseQueryForAlert } from "../utils/parseQueryForAlert";
import { fetchLanding } from "../api-functions/cms/ContentfulLanding";
import { LandingContent } from "../interfaces/contentful-landing";
import { RichContentfulContent } from "../components/RichContentfulContent";
import { RelevantArticle } from "../components/landing/RelevantArticle";

type Props = {
  landingContent: LandingContent;
};

function IndexPage({ landingContent }: Props) {
  const { query } = useRouter();
  const toast = useToast();
  const {
    metadata,
    violations,
    facts,
    explanations,
    didYouKnows,
    relevantArticles,
  } = landingContent;

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
          {metadata.title}
        </Heading>
        <Stack width={{ sm: "100%", md: "80%" }} userSelect="none">
          <RichContentfulContent content={metadata.richDescription} />
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
              {metadata.buttonStartNow}
            </Button>
          </Link>
        </Box>
        <Stack marginTop="30pt">
          {explanations.map((explanation, i) => (
            <Stack key={i} isInline align="center" spacing={2}>
              {renderIcon(explanation.icon)}
              <RichContentfulContent content={explanation.richDescription} />
            </Stack>
          ))}
        </Stack>
      </Flex>
      <Box mt={{ base: "32pt", md: 0 }}>
        <Subheading>{metadata.whyThisToolTitle}</Subheading>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2} marginTop="16pt">
          {facts.map((fact, index) => {
            return (
              <EnergyFactContainer
                key={fact.title}
                backgroundImage={fact.backgroundImage.url}
              >
                <Heading
                  as="h3"
                  fontFamily="Lora, serif"
                  fontSize="1.5rem"
                  fontWeight="500"
                  color={
                    fact.lightTextColor ? "rgba(255,255,255,0.6)" : undefined
                  }
                >
                  {fact.title}
                </Heading>
                <Text
                  width={index === 0 ? "70%" : "100%"}
                  color={fact.lightTextColor ? "white" : undefined}
                >
                  {fact.description}
                </Text>
              </EnergyFactContainer>
            );
          })}
        </SimpleGrid>
      </Box>
      <Box marginTop={{ base: "32pt", md: "64pt" }}>
        <Subheading>{metadata.howWeHelpTitle}</Subheading>
        <Text width="100%">{metadata.kitchenIntro}</Text>
        <HomeAssessmentInteractiveExample violations={violations} />
      </Box>
      <Box marginTop="64pt">
        <Subheading>{metadata.didYouKnowTitle}</Subheading>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={{ base: 6, md: 12 }}
          marginTop={2}
        >
          {didYouKnows.map((element, index) => {
            return (
              <FactContainer key={index} title={element.title}>
                <Text>{element.description}</Text>
                <ChakraLink
                  color="green.500"
                  href={element.sourceUrl}
                  isExternal
                >
                  {element.sourceName}
                </ChakraLink>
              </FactContainer>
            );
          })}
        </SimpleGrid>
      </Box>
      <Box marginTop="64pt">
        <Subheading>{metadata.articleTitle}</Subheading>
        <SimpleGrid columns={{ sm: 1, md: 4 }} spacing={4} py="16pt">
          {relevantArticles.map((article, i) => (
            <RelevantArticle key={i} article={article} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

const iconStyles = {
  color: "rgba(59, 168, 0, 1.000)",
  w: "22px",
  h: "22px",
};

const renderIcon = (icon: string) => {
  switch (icon) {
    case "FaRunning":
      return <Icon as={FaRunning} {...iconStyles} />;
    case "BiSend":
      return <Icon as={BiSend} {...iconStyles} />;
    case "AiOutlineSafety":
      return <Icon as={AiOutlineSafety} {...iconStyles} />;
    default:
      break;
  }
  return null;
};

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

const EnergyFactContainer: React.FC<{ backgroundImage: string | null }> = ({
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
  const landingContent = await fetchLanding();

  for (const relevantArticle of landingContent.relevantArticles) {
    const previewImage = await fetchLinkPreviewImage(relevantArticle.sourceUrl);
    relevantArticle.previewImage = previewImage;
  }

  return { props: { landingContent } };
};

export default IndexPage;
