import * as React from "react";
import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Stack,
} from "@chakra-ui/react";
import {
  Landlords,
  LANDLORDS,
  HomeDetails as HomeDetailsType,
  RentalType,
  RENTAL_TYPES,
} from "../../../interfaces/home-assessment";
import { setAsUndefinedInsteadOfEmptyString } from "../helpers/setAsUndefinedInsteadOfEmptyString";
import { validateHomeDetailsForm } from "../helpers/validateHomeDetailsForm";
import { validatePrice } from "../helpers/validatePrice";

import { AddressSelector } from "./AddressSelector";

type Props = {
  loading: boolean;
  submitDetails: (details: HomeDetailsType) => void;
};

export const HomeAssessmentDetails: React.FC<Props> = ({
  submitDetails,
  loading,
}) => {
  const [details, setDetails] = React.useState<Partial<HomeDetailsType>>({});
  const [showValidationErrors, setShowValidationErrors] = React.useState(false);

  const handleAddressChange = React.useCallback(
    (newAddress: HomeDetailsType["address"] | undefined) => {
      setDetails((details) => ({
        ...details,
        address: newAddress,
      }));
    },
    []
  );

  const handleRentPriceChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;
      setDetails((details) => ({
        ...details,
        totalRent: setAsUndefinedInsteadOfEmptyString(value),
      }));
    },
    []
  );

  const handleRentalTypeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value as RentalType;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (newValue && !RENTAL_TYPES.includes(newValue))
        throw new Error("invalid rental type");

      setDetails((details) => ({
        ...details,
        rentalType: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleLandlordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value as Landlords;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (newValue && !LANDLORDS.includes(newValue))
        throw new Error("invalid rental type");

      setDetails((details) => ({
        ...details,
        landlord: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleLandlordOtherChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setDetails((details) => ({
        ...details,
        landlordOther: setAsUndefinedInsteadOfEmptyString(value),
      }));
    },
    []
  );

  const handleUnitNumberChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setDetails((details) => ({
        ...details,
        unitNumber: setAsUndefinedInsteadOfEmptyString(value),
      }));
    },
    []
  );

  const handleNextButtonClick = React.useCallback(() => {
    if (validateHomeDetailsForm(details)) {
      // this should not be risky since we are validating beforehand
      submitDetails(details as HomeDetailsType);
    } else {
      setShowValidationErrors(true);
    }
  }, [details, submitDetails]);

  const isTotalRentValid = React.useMemo(() => {
    if (details.totalRent) {
      return validatePrice(details.totalRent);
    }
    // When the user first launches the form, the field should not be in an error state
    // unless showValidationErrors is enabled
    return !showValidationErrors;
  }, [showValidationErrors, details.totalRent]);

  const otherLandlordField = React.useMemo(
    () =>
      details.landlord === "Other" ? (
        <FormControl
          flexBasis={"40%"}
          isRequired={true}
          isInvalid={!details.landlordOther && showValidationErrors}
        >
          <FormLabel fontSize="sm">Other (please specify)</FormLabel>
          <Input
            placeholder={"Tina Smith"}
            size="md"
            value={details.landlordOther ?? ""}
            onChange={handleLandlordOtherChange}
          />
        </FormControl>
      ) : null,
    [
      details.landlord,
      details.landlordOther,
      handleLandlordOtherChange,
      showValidationErrors,
    ]
  );

  return (
    <Box width="100%" alignItems="center">
      <Stack padding="4pt" marginTop="16pt" maxWidth="800px">
        <Heading as="h3" size="xs" textTransform="uppercase" marginBottom="8pt">
          Details
        </Heading>
        <Stack>
          <AddressSelector
            validatedAddress={details.address?.formatted}
            setValidatedAddress={handleAddressChange}
            showValidationErrors={showValidationErrors}
          />
          <FormControl flexBasis={"10%"}>
            <FormLabel fontSize="sm">Unit #</FormLabel>
            <Input
              placeholder={"3"}
              aria-describedby="unit number"
              size="md"
              value={details.unitNumber ?? ""}
              onChange={handleUnitNumberChange}
            />
          </FormControl>
          <FormControl
            flexBasis="30%"
            minW={"265px"}
            isInvalid={!details.rentalType && showValidationErrors}
            isRequired={true}
          >
            <FormLabel fontSize="sm">Rental Type</FormLabel>
            <Select
              placeholder="Select option"
              size="md"
              value={details.rentalType}
              onChange={handleRentalTypeChange}
            >
              {RENTAL_TYPES.map((houseType) => (
                <option key={houseType} value={houseType}>
                  {houseType}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isInvalid={!isTotalRentValid} isRequired={true}>
            <FormLabel fontSize="sm">Total Rent cost</FormLabel>
            <InputGroup>
              <InputLeftElement color="gray.300">$</InputLeftElement>
              <Input
                placeholder="Enter amount"
                value={details.totalRent ?? ""}
                onChange={handleRentPriceChange}
              />
              <InputRightElement>
                {details.totalRent && isTotalRentValid ? (
                  <CheckIcon color="green.500" />
                ) : null}
                {details.totalRent && !isTotalRentValid ? (
                  <NotAllowedIcon color="red.500" />
                ) : null}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl
            flexBasis={"40%"}
            isRequired={true}
            isInvalid={!details.landlord && showValidationErrors}
          >
            <FormLabel fontSize="sm">Landlord</FormLabel>
            <Select
              placeholder="Select option"
              size="md"
              value={details.landlord}
              onChange={handleLandlordChange}
            >
              {LANDLORDS.map((landlord) => (
                <option key={landlord} value={landlord}>
                  {landlord}
                </option>
              ))}
            </Select>
          </FormControl>
          {otherLandlordField}
        </Stack>
        <Box>
          <Button
            colorScheme="green"
            size="sm"
            marginTop={"16pt"}
            onClick={handleNextButtonClick}
            isLoading={loading}
          >
            Next
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
