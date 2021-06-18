import React, { ReactNode } from "react";
import { FaFacebook, FaInstagram, FaRecycle, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";
import styled from "@emotion/styled";
import {
  Stack,
  Text,
  Button,
  IconButton,
  Link as ChakraLink,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { useUserStepState } from "../hooks/useUserStepState";

type Props = {
  children?: ReactNode;
  title: string;
  description: string;
  showStartButton?: boolean;
  showSocialIcons?: boolean;
  showLastResults?: boolean;
  displayPromotionOffering?: () => void;
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  max-width: 1250px;
  position: relative;
  box-sizing: border-box;
  padding: 24pt;
  margin: 0 auto;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  height: 2rem;
  left: 24pt;
  right: 24pt;
`;

const Content = styled.div`
  padding-bottom: 2rem;
`;

const VERCEL_SPONSORED_LINK =
  "https://vercel.com?utm_source=qbacc-home-project&utm_campaign=oss";

const Layout = ({
  children,
  title,
  description,
  showLastResults = true,
  showStartButton = false,
  showSocialIcons = false,
  displayPromotionOffering,
}: Props) => {
  const { hasSubmissionId, hasAssessmentResult } = useUserStepState();

  return (
    <Container>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta name="title" content={title} />
        <meta name="description" content={description} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homestandards.org" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/banner.png" />
        {/* Twitte */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://homestandards.org" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta
          property="twitter:image"
          content="https://homestandards.org/banner.png"
        />
      </Head>
      <header>
        <nav>
          <SimpleGrid
            spacing={4}
            columns={{ base: 1, md: 3 }}
            templateColumns={{ base: "100%", md: "auto 1fr auto" }}
            justifyItems={{ base: "center", md: "flex-end" }}
          >
            <Link href="/">
              <img
                src="/logo.svg"
                style={{ height: "56px", cursor: "pointer" }}
                alt="Home Standards Project"
              />
            </Link>
            <Stack
              isInline
              spacing={4}
              align="center"
              justify={{ base: "space-around", md: "flex-end" }}
            >
              <Link href="/about">
                <Text
                  as="a"
                  textColor="blue.700"
                  fontWeight="bold"
                  fontSize="sm"
                  display="block"
                  cursor="pointer"
                  whiteSpace="nowrap"
                >
                  About Us
                </Text>
              </Link>
              <Link href="/blog">
                <Text
                  as="a"
                  textColor="blue.700"
                  fontWeight="bold"
                  fontSize="sm"
                  display="block"
                  cursor="pointer"
                  whiteSpace="nowrap"
                >
                  Blog
                </Text>
              </Link>
              <Link href="/resources">
                <Text
                  as="a"
                  textColor="blue.700"
                  fontWeight="bold"
                  fontSize="sm"
                  display="block"
                  cursor="pointer"
                >
                  Resources
                </Text>
              </Link>
              <Link href="/next-steps">
                <Text
                  as="a"
                  textColor="blue.700"
                  fontWeight="bold"
                  fontSize="sm"
                  display="block"
                  cursor="pointer"
                >
                  Reporting
                </Text>
              </Link>
              <Link href="/privacy">
                <Text
                  as="a"
                  textColor="blue.700"
                  fontWeight="bold"
                  fontSize="sm"
                  display="block"
                  cursor="pointer"
                >
                  Privacy
                </Text>
              </Link>
            </Stack>
            <Stack isInline align="center" width="auto">
              <ChakraLink
                href="https://www.paypal.com/donate?hosted_button_id=AGNW37L4YTKTL"
                isExternal
                _hover={{ textDecoration: "none" }}
              >
                <Text
                  textColor="blue.700"
                  fontWeight="bold"
                  fontSize="sm"
                  display="block"
                  cursor="pointer"
                >
                  Donate
                </Text>
              </ChakraLink>
              {showStartButton && (
                <Link href="/start">
                  <Button colorScheme="blue" size="sm">
                    {hasSubmissionId ? "Continue Evaluation" : "Start"}
                  </Button>
                </Link>
              )}
              {hasAssessmentResult && showLastResults && (
                <Link href="/results">
                  <Button colorScheme="blue" size="sm" variant="outline">
                    View last result
                  </Button>
                </Link>
              )}
              {displayPromotionOffering && (
                <Button
                  leftIcon={<FaRecycle />}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                  onClick={displayPromotionOffering}
                >
                  Collect your free Green Bin
                </Button>
              )}
            </Stack>
          </SimpleGrid>
        </nav>
      </header>
      <Content>{children}</Content>
      <Footer>
        <Flex justify="space-between" alignItems="baseline">
          <a href={VERCEL_SPONSORED_LINK} target="_blank" rel="noreferrer">
            <Stack
              justifyContent="flex-start"
              height="16pt"
              isInline
              alignItems="center"
            >
              <Text fontSize="xs">Powered By</Text>
              <svg
                height="9pt"
                viewBox="0 0 283 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                  fill="#000"
                />
              </svg>
            </Stack>
          </a>
          {showSocialIcons && (
            <Stack isInline spacing={0} bg="gray.200" borderRadius="lg" mb={4}>
              <ChakraLink href="mailto:connect@homestandards.org">
                <IconButton
                  size="md"
                  color="blue.700"
                  variant="ghost"
                  aria-label="Link to the Home Standards Email"
                  icon={<EmailIcon />}
                />
              </ChakraLink>
              <ChakraLink
                href="https://www.facebook.com/HomeStandardsProject"
                isExternal
              >
                <IconButton
                  size="md"
                  color="blue.700"
                  variant="ghost"
                  aria-label="Link to Home Standards Facebook"
                  icon={<FaFacebook />}
                />
              </ChakraLink>
              <ChakraLink
                href="https://www.instagram.com/home_standards/"
                isExternal
              >
                <IconButton
                  size="md"
                  color="blue.700"
                  variant="ghost"
                  aria-label="Link to Home Standards Instagram"
                  icon={<FaInstagram />}
                />
              </ChakraLink>
              <ChakraLink href="https://twitter.com/home_standards" isExternal>
                <IconButton
                  size="md"
                  color="blue.700"
                  variant="ghost"
                  aria-label="Link to Home Standards Twitter"
                  icon={<FaTwitter />}
                />
              </ChakraLink>
            </Stack>
          )}
        </Flex>
      </Footer>
    </Container>
  );
};

export default Layout;
