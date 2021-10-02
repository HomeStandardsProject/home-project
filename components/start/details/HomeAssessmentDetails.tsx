import * as React from "react";
import { CheckIcon, InfoIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Stack,
  Tooltip,
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
import { ContentfulCity } from "../../../interfaces/contentful-city";

type Props = {
  selectedCity: ContentfulCity;
  loading: boolean;
  submitDetails: (details: HomeDetailsType) => void;
};

export const HomeAssessmentDetails: React.FC<Props> = ({
  selectedCity,
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

  const handleNumberOfValueChangres = React.useCallback(
    (_, numberOfBedrooms: number) =>
      setDetails((details) => ({ ...details, numberOfBedrooms })),
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

  React.useEffect(() => {
    setDetails((oldVal) => ({ ...oldVal, city: selectedCity.name }));
  }, [selectedCity]);

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
    <>
      <Stack>
        <Stack isInline>
          <AddressSelector
            city={selectedCity}
            validatedAddress={details.address?.formatted}
            setValidatedAddress={handleAddressChange}
            showValidationErrors={showValidationErrors}
          />
          <FormControl flexBasis={"20%"}>
            <FormLabel fontSize="sm">Unit</FormLabel>
            <Input
              placeholder={"3"}
              aria-describedby="unit number"
              size="md"
              value={details.unitNumber ?? ""}
              onChange={handleUnitNumberChange}
            />
          </FormControl>
        </Stack>
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
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          templateColumns={{ sm: "100%", md: "60% 40%" }}
          spacing={2}
        >
          <FormControl
            isInvalid={!isTotalRentValid}
            isRequired={true}
            flexBasis="60%"
          >
            <FormLabel fontSize="sm">Total Rent Cost</FormLabel>
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
            isRequired={true}
            flexBasis={"40%"}
            isInvalid={!details.numberOfBedrooms && showValidationErrors}
          >
            <FormLabel fontSize="sm">Number of Bedrooms</FormLabel>
            <NumberInput
              isInvalid={!details.numberOfBedrooms && showValidationErrors}
              value={details.numberOfBedrooms}
              min={1}
              onChange={handleNumberOfValueChangres}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Enter a valid number of rooms</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
        <FormControl
          isRequired={true}
          isInvalid={!details.landlord && showValidationErrors}
        >
          <Stack isInline spacing={0}>
            <FormLabel fontSize="sm">Landlord</FormLabel>
            <Tooltip label="The Home Standards Project does not send assessments to landlords.">
              <Box>
                <InfoIcon
                  color="blue.700"
                  verticalAlign="baseline"
                  mt={0.5}
                  w="11pt"
                  h="11pt"
                />
              </Box>
            </Tooltip>
          </Stack>
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
    </>
  );
};
