import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Icon, Link, Stack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import NextLink from "next/link";
import * as React from "react";
import { FaFacebook } from "react-icons/fa";
import { fetchResources } from "../api-functions/cms/ContentfulResources";
import Layout from "../components/Layout";
import { RichContentfulContent } from "../components/RichContentfulContent";
import {
  ResourcesAndContacts,
  ResourcesAndContactsContent,
} from "../interfaces/contentful-resources";
import { LocationFilter } from "../components/shared";
import { fetchAvailableCountries } from "../api-functions/cms/ContentfulCountries";
import { ContentfulCountry } from "../interfaces/contentful-country";

type Props = {
  resourcesAndContactsContent: ResourcesAndContactsContent;
  availableCountries: ContentfulCountry[];
};

function Resources({ resourcesAndContactsContent, availableCountries }: Props) {
  const { resourcesAndContacts } = resourcesAndContactsContent;
  const [filteredItems, setFilteredItems] = React.useState(null as any);

  const filterItems = (items: any[]) => {
    if (!items?.length) return items;
    if (filteredItems === null) return items;
    if (filteredItems.length === 0) return [];

    return items.filter(({ id }) => filteredItems?.includes(id));
  };

  const items = filterItems(resourcesAndContacts);

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

        <LocationFilter
          {...{
            filterParams: availableCountries,
            items: resourcesAndContacts.map(({ id, country, state, city }) => ({
              id,
              country: country && country,
              state: state && state,
              city: city && { slug: city.slug, title: city.name },
            })),
            onFilterChange: setFilteredItems,
          }}
        />

        <Stack spacing={4}>
          {items?.length ? (
            <>
              {items.map((props) => (
                <ResourcePanel key={props.name} {...props} />
              ))}
            </>
          ) : (
            <>Nothing found</>
          )}
        </Stack>
        <Box>
          <NextLink href="/next-steps">
            <Button mt={8} colorScheme="blue" variant="outline">
              Steps for Reporting Issues
            </Button>
          </NextLink>
        </Box>
      </Stack>
    </Layout>
  );
}

function ResourcePanel({
  name,
  nameUrl,
  email,
  richDescription,
  phoneNumber,
  phoneNumberExtension,
  facebookName,
  facebookUrl,
}: ResourcesAndContacts) {
  return (
    <Box>
      <Link href={nameUrl} color="blue.600" fontWeight="600" isExternal>
        {name}
      </Link>
      <RichContentfulContent content={richDescription} />
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
        {facebookName && facebookUrl && (
          <Link href={facebookUrl} isExternal>
            <Button
              leftIcon={<Icon as={FaFacebook} />}
              color="blue.700"
              fontWeight="400"
              size="sm"
            >
              {facebookName}
            </Button>
          </Link>
        )}
      </Stack>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const resourcesAndContactsContent = await fetchResources();
  const availableCountries = await fetchAvailableCountries();

  return {
    props: { resourcesAndContactsContent, availableCountries },
    revalidate: 60,
  };
};

export default Resources;
