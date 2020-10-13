import {
  Box,
  Button,
  Divider,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/core";
import * as React from "react";
import Layout from "../components/Layout";

const ResultPage: React.FC = () => {
  return (
    <Layout title="Results">
      <Stack marginTop="16pt" marginBottom="16pt" spacing={1}>
        <Heading as="h4" color="gray.700" size="md">
          439 Johnson St
        </Heading>
        <Stack isInline spacing={2}>
          <Tag size="sm" variantColor="green">
            $900
          </Tag>
          <Tag size="sm" variantColor="green">
            Condo
          </Tag>
          <Tag size="sm" variantColor="green">
            Highpoint properties
          </Tag>
        </Stack>
        <Divider />
        <Box marginTop="16pt">
          <Heading as="h3" size="xl">
            18 Violations
          </Heading>
          <Text color="gray.400">Generated October 10th 2020</Text>
          <Box marginTop="8pt">
            <Menu>
              <MenuButton
                as={Button}
                color="green"
                size="sm"
                // @ts-ignore: icon is supported
                rightIcon="chevron-down"
              >
                Export
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
        <Box marginTop="16pt">
          <Heading as="h4" size="md">
            Breakdown
          </Heading>
          <Stack marginTop="16pt" isInline>
            <Text as="b" width="30%" minW="200px">
              Bedroom 1
            </Text>
            <Stack flexBasis="100%" spacing={4}>
              <Box>
                <Text as="i">Appliances 4.8</Text>
                <Text>
                  All appliances, equipment, accessories and installations
                  provided by the Owner shall be installed and Maintained in
                  good repair and working order and used for their intended
                  purposes. (By-law Number 2005-100; 2015-15)
                </Text>
                <Stack
                  bg="blue.100"
                  padding="4pt"
                  isInline
                  align="center"
                  marginTop="8pt"
                >
                  <Icon name="info-outline" />
                  <Text>
                    Kitchen oven doesn&apos;t work, left knob isn&apos;t
                    function.
                  </Text>
                </Stack>
              </Box>
              <Box>
                <Text as="i">Appliances 4.8</Text>
                <Text>
                  All appliances, equipment, accessories and installations
                  provided by the Owner shall be installed and Maintained in
                  good repair and working order and used for their intended
                  purposes. (By-law Number 2005-100; 2015-15)
                </Text>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default ResultPage;
