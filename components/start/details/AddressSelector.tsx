import { CheckIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Box,
  Text,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import * as React from "react";

import { ApiHomeDetailsLocationResult } from "../../../interfaces/api-home-details";
import { HomeDetails } from "../../../interfaces/home-assessment";
import { useDebounce } from "../hooks/useDebounce";
import { useHomeDetailsLocationApi } from "./hooks/useHomeDetailsLocation";

type Props = {
  showValidationErrors: boolean;
  validatedAddress: string | undefined;
  setValidatedAddress: (newAddress: HomeDetails["address"] | undefined) => void;
};

export function AddressSelector({
  validatedAddress,
  showValidationErrors,
  setValidatedAddress,
}: Props) {
  const [unvalidatedAddress, setUnvalidatedAddress] = React.useState("");
  const [searchMatches, setSearchMatches] = React.useState<
    ApiHomeDetailsLocationResult["matches"]
  >([]);
  const { fetchMachingLocations, loading } = useHomeDetailsLocationApi();
  const debouncedUnvalidatedAddress = useDebounce(unvalidatedAddress, 500);

  const handleAddressChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUnvalidatedAddress(event.target.value);

      if (validatedAddress) {
        setValidatedAddress(undefined);
      }
    },
    [validatedAddress, setValidatedAddress]
  );

  const handleAddressClick = React.useCallback(
    (matchIndex: number) => {
      const match = searchMatches[matchIndex];
      setValidatedAddress({
        long: match.long,
        lat: match.lat,
        formatted: match.address,
        userProvided: unvalidatedAddress,
      });
    },
    [setValidatedAddress, searchMatches, unvalidatedAddress]
  );

  React.useEffect(() => {
    fetchMachingLocations(debouncedUnvalidatedAddress).then((result) => {
      setSearchMatches(result.locationResults.matches);
    });
  }, [fetchMachingLocations, debouncedUnvalidatedAddress]);

  return (
    <FormControl
      isInvalid={!validatedAddress && showValidationErrors}
      isRequired={true}
    >
      <FormLabel fontSize="sm">Address</FormLabel>
      <FormErrorMessage>Please select a valid address</FormErrorMessage>
      <Box borderColor="#E2E8F0" borderWidth="1px" borderRadius="lg">
        <Stack isInline padding="0.5rem 1rem">
          <Input
            placeholder={"100 University Avenue"}
            aria-describedby="address"
            size="md"
            value={validatedAddress || unvalidatedAddress}
            onChange={handleAddressChange}
            variant="unstyled"
            autoComplete="off"
          />
          {loading && <Spinner size="sm" />}
          {validatedAddress && <CheckIcon color="green.500" />}
        </Stack>
        {!validatedAddress && searchMatches.length > 0 && (
          <Box padding="0 0.5rem" marginBottom="8pt">
            {searchMatches.map((match, i) => (
              <Stack
                key={match.address}
                padding="0.25rem 0.5rem"
                bg="gray.100"
                borderRadius="md"
                cursor="pointer"
                isInline
                align="center"
                onClick={() => handleAddressClick(i)}
              >
                <Box
                  width="8pt"
                  height="8pt"
                  bg="gray.300"
                  borderRadius="4pt"
                ></Box>
                <Text fontSize="sm">{match.address}</Text>
              </Stack>
            ))}
          </Box>
        )}
      </Box>
    </FormControl>
  );
}
