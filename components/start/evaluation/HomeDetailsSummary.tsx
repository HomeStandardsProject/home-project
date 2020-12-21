import { Box, Stack, Tag, Text } from "@chakra-ui/react";
import * as React from "react";
import { HomeDetails } from "../../../interfaces/home-assessment";
import { useLayoutType } from "../hooks/useLayoutType";

type Props = {
  details: Partial<HomeDetails>;
};

export const HomeDetailsSummary: React.FC<Props> = ({ details }) => {
  const landlordInfo = React.useMemo(
    () =>
      details.landlord === "Other"
        ? `Other ${details.landlordOther}`
        : details.landlord,
    [details.landlord, details.landlordOther]
  );
  const layoutType = useLayoutType();

  const isDesktop = React.useMemo(() => layoutType === "desktop", [layoutType]);

  return (
    <Box padding="8pt" rounded="lg" bg="gray.100">
      <Stack spacing={0}>
        <Stack isInline={isDesktop} spacing={isDesktop ? 4 : 0}>
          <Text as="b" color="gray.800">
            {details.address}
          </Text>
          <Stack spacing={2} isInline>
            <Tag size="sm" colorScheme="green" variant="outline">
              ${details.totalRent}
            </Tag>
            <Tag size="sm" colorScheme="green" variant="outline">
              {details.rentalType}
            </Tag>
          </Stack>
        </Stack>
        <Text fontSize="sm">{landlordInfo}</Text>
      </Stack>
    </Box>
  );
};
