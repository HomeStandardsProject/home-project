import {
  Heading,
  Icon,
  PseudoBox,
  Stack,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/core";
import * as React from "react";
import { HomeDetails } from "../../interfaces/home-assessment";

type Props = {
  details: Partial<HomeDetails>;
  switchToDetails: () => void;
};

export const HomeDetailsSummary: React.FC<Props> = ({
  details,
  switchToDetails,
}) => {
  const landlordInfo = React.useMemo(
    () =>
      details.landlord === "Other"
        ? `Other ${details.landlordOther}`
        : details.landlord,
    [details.landlord, details.landlordOther]
  );

  return (
    <Stack padding="4pt">
      <Heading as="h3" size="xs" textTransform="uppercase" marginBottom="8pt">
        Details
      </Heading>
      <PseudoBox
        padding="8pt"
        rounded="lg"
        bg="gray.100"
        cursor="pointer"
        _hover={{ bg: "gray.200" }}
        onClick={switchToDetails}
      >
        <Stack isInline align="center">
          <Stack spacing={0} flexBasis="100%">
            <Stack isInline spacing={4}>
              <Text as="b" color="gray.800">
                {details.address}
              </Text>
              <Stack spacing={2} isInline>
                <Tag size="sm" variantColor="green" variant="outline">
                  ${details.totalRent}
                </Tag>
                <Tag size="sm" variantColor="green" variant="outline">
                  {details.rentalType}
                </Tag>
              </Stack>
            </Stack>
            <Text fontSize="sm">{landlordInfo}</Text>
          </Stack>
          <Tooltip
            aria-label="click to edit"
            label="Click to edit"
            placement="bottom"
          >
            <Icon name="settings" color="gray.500" />
          </Tooltip>
        </Stack>
      </PseudoBox>
    </Stack>
  );
};
