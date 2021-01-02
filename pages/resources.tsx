import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import Layout from "../components/Layout";

const RESOURCES: ResourcePanelProps[] = [
  {
    name: "City of Kingston - Property Standards Bylaw",
    nameLink:
      "https://www.cityofkingston.ca/documents/10180/16904/Property+Standards+Bylaw/703dbda5-61ce-4a37-b3f4-57f64d3966f8",
    description:
      "This document outlines the minimum standards for building and property maintenance within Kingston.",
  },
  {
    name: "Kingston's Property Standards Office",
    nameLink: "https://www.cityofkingston.ca/resident/property-standards",
    description:
      "They are the experts on The City's Property Standards bylaws. Contact them if your landlord does not fix the issues found in your unit or if you have further questions about specific bylaws.",
    email: "bylawenforcement@cityofkingston.ca",
    phoneNumber: "613-546-4291",
    phoneNumberExtension: "3280",
  },
  {
    name: "Queen's Student Community Relations (SCR) Office",
    nameLink: "https://www.queensu.ca/studentcommunityrelations/home",
    description:
      "The SCR offers 30 to 90-minute information sessions with Adam King, Off-Campus Living Advisor. They are available to help with questions related to tenants and landlords' rights and responsibilities, applications and lease agreements and more. Schedule your free appointment by emailing their office.",
    email: "scr@queensu.ca",
    phoneNumber: "613-533-6745",
  },
  {
    name: "Housing Resource Centre",
    nameLink: "https://myams.org/team-details/housing-resource-centre/",
    description: `An AMS initiative designed to "support students who are experiencing a conflict with a landlord or housemate in a safe and confidential space. Trained student volunteers can also answer questions and provide information on property standards, leases, tenant rights, house hunting, home security, and more."`,
    email: "hrc@ams.queensu.ca",
    phoneNumber: "613-533-6000",
    phoneNumberExtension: "32327",
  },
];

function Resources() {
  return (
    <Layout
      title="Resources"
      description="List of valuable resources and contacts"
      showStartButton={true}
    >
      <Stack marginTop="16pt" maxWidth="950px">
        <Heading as="h1" size="lg">
          Resources and Contacts
        </Heading>
        <Stack spacing={4}>
          {RESOURCES.map((props) => (
            <ResourcePanel key={props.name} {...props} />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
}

type ResourcePanelProps = {
  name: string;
  nameLink: string;
  description: string;
  email?: string;
  phoneNumber?: string;
  phoneNumberExtension?: string;
};

function ResourcePanel({
  name,
  nameLink,
  email,
  description,
  phoneNumber,
  phoneNumberExtension,
}: ResourcePanelProps) {
  return (
    <Box>
      <Link href={nameLink} color="blue.600" fontWeight="600" isExternal>
        {name}
      </Link>
      <Text>{description}</Text>
      <Stack isInline marginTop="8pt">
        {email && (
          <Link href={`mailto:${email}`}>
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
              leftIcon={<EmailIcon />}
            >
              {email}
            </Button>
          </Link>
        )}
        {phoneNumber && (
          <Link href={`tel:${phoneNumber}`}>
            <Button
              color="blue.700"
              fontWeight="400"
              size="sm"
              leftIcon={<PhoneIcon />}
            >
              {phoneNumber}{" "}
              {phoneNumberExtension && `(ext. ${phoneNumberExtension})`}
            </Button>
          </Link>
        )}
      </Stack>
    </Box>
  );
}

export default Resources;
