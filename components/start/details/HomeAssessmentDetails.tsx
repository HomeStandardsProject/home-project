import * as React from "react";
import { CheckIcon, InfoIcon, NotAllowedIcon, WarningIcon, } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
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

type Props = {
  loading: boolean;
  submitDetails: (details: HomeDetailsType) => void;
  showInvalidMarkerIfNeeded?: boolean;
};

export const HomeAssessmentDetails: React.FC<Props> = ({
  submitDetails,
  loading,
}) => {
  const [details, setDetails] = React.useState<Partial<HomeDetailsType>>({});
  const [showValidationErrors, setShowValidationErrors] = React.useState(false);
  const [showInvalidMarkerIfNeeded, setShowInvalidMarkerIfNeeded] = React.useState(false);

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

  const handleWaterChange = React.useCallback(
    (newValue: string) => {
      setDetails((details) => ({
        ...details,
        waterInRent: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleHydroChange = React.useCallback(
    (newValue: string) => {
      setDetails((details) => ({
        ...details,
        hydroInRent: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleGasChange = React.useCallback(
    (newValue: string) => {
      setDetails((details) => ({
        ...details,
        gasInRent: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleInternetChange = React.useCallback(
    (newValue: string) => {
      setDetails((details) => ({
        ...details,
        internetInRent: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleParkingChange = React.useCallback(
    (newValue: string) => {
      setDetails((details) => ({
        ...details,
        parkingInRent: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    []
  );

  const handleOtherChange = React.useCallback(
    (newValue: string) => {
      setDetails((details) => ({
        ...details,
        otherInRent: setAsUndefinedInsteadOfEmptyString(newValue),
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

  const handleOtherValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;
      setDetails((details) => ({
        ...details,
        otherValue: setAsUndefinedInsteadOfEmptyString(value),
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
      setShowInvalidMarkerIfNeeded(true);
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

  const otherInRentField = React.useMemo(
    () =>
      details.otherInRent === "YES" ? (
        <Stack isInline align="center" spacing={4} paddingTop="5pt">
          <FormControl
            flexBasis={"100%"}
            isRequired={true}
            isInvalid={!details.otherValue && showValidationErrors}
          >
            <FormLabel fontSize="sm">Please specify:</FormLabel>
            <Input
              placeholder={"What else is included in your rent?"}
              size="md"
              maxWidth={"800px"}
              value={details.otherValue ?? ""}
              onChange={handleOtherValueChange}
            />
          </FormControl>
        </Stack>
      ) : null,
    [
      details.otherInRent,
      details.otherValue,
      handleOtherValueChange,
      showValidationErrors,
    ]
  );

  return (
    <Box width="100%" alignItems="center">
      <Stack padding="4pt" marginTop="16pt" maxWidth="800px">
        <Stack isInline spacing={0}>
          <Heading as="h1" size="lg">
            Details
          </Heading>
          <Tooltip
          maxWidth="750px"
          marginLeft="50px"
          label="Home Standards is seeking to create a full and holistic dataset on rental properties and their issues so we can identify common property issues renters face. To do this, we want to find correlations, namely between unit rent costs, landlords, general locations and property standard violations. We will never share individual submissions and if we should publish anything, the data will be on aggregate with no identifying features. For example, we may indicate that across the city X violation was the most common, or that there was a correlation between a specific landlord and Y violation. Our hope here is that by sharing such general information, we can generate awareness about the quality of rental housing, renters can realize that the standard of housing is expected to be much higher than they expect, and repairs can occur. We share no specific data to anyone, everything remains in house. There will be no way to identify you in these reports. We are just economics graduates who like a good, full dataset to analyze and enjoy spending countless hours on Stata.">
            <Box>
              <Text
              color="white"
              size="md"
              as="h1"
              marginTop="1pt"
              marginLeft="25pt"
              border="2px"
              borderRadius="10pt"
              background="blue.700"
              padding="3pt"
              >
              Why are we asking this?
              </Text>
            </Box>
          </Tooltip>
        </Stack>
        <Stack>
          <Stack isInline>
            <AddressSelector
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
              <Stack isInline spacing={0}>
                <FormLabel fontSize="sm">Rent Cost Per Month</FormLabel>
                <Tooltip
                marginLeft="50px"
                label="Only the cost of rent, please subtract off any additional fees for optional amenities (Ex. $50 for parking, $25 for a gym pass, not utilities or management fees)">
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
                min={0}
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
          /////////TOP//////////////
          <FormControl
            isRequired={true}
            isInvalid={!details.waterInRent && !details.hydroInRent &&
              !details.gasInRent && !details.internetInRent &&
              !details.parkingInRent && !details.otherInRent &&
              showValidationErrors}
          >
            <Stack spacing={0}>
              <FormLabel fontSize="sm">Included in Rent</FormLabel>
              //*****************
              <Box>
              <Stack isInline align="center">
                {showInvalidMarkerIfNeeded && !details.waterInRent && (
                  <WarningIcon color="red.500" />
                )}
                    <Text>
                      Water
                    </Text>
                <RadioGroup
                  onChange={handleWaterChange}
                  value={details.waterInRent ?? ""}
                >
                  <Stack isInline align="center" spacing={4}>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="YES" bg="gray.200" borderColor="gray.300">
                        Yes
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="NO" bg="gray.200" borderColor="gray.300">
                        No
                      </Radio>
                    </Box>
                  </Stack>
                </RadioGroup>
                </Stack>
              </Box>
              //*****************
              <Box paddingTop="5pt">
                <Stack isInline align="center">
                  {showInvalidMarkerIfNeeded && !details.hydroInRent && (
                    <WarningIcon color="red.500" />
                  )}
                  <Text>
                    Hydro
                  </Text>
                <RadioGroup
                  onChange={handleHydroChange}
                  value={details.hydroInRent ?? ""}
                >
                  <Stack isInline align="center" spacing={4}>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="YES" bg="gray.200" borderColor="gray.300">
                        Yes
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="NO" bg="gray.200" borderColor="gray.300">
                        No
                      </Radio>
                    </Box>
                  </Stack>
                </RadioGroup>
                </Stack>
              </Box>
              //*****************
              <Box paddingTop="5pt">
                <Stack isInline align="center">
                  {showInvalidMarkerIfNeeded && !details.gasInRent && (
                    <WarningIcon color="red.500" />
                  )}
                  <Text>
                    Gas
                  </Text>
                <RadioGroup
                  onChange={handleGasChange}
                  value={details.gasInRent ?? ""}
                >
                  <Stack isInline align="center" spacing={4}>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="YES" bg="gray.200" borderColor="gray.300">
                        Yes
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="NO" bg="gray.200" borderColor="gray.300">
                        No
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="UNAVAILABLE" bg="gray.200" borderColor="gray.300">
                        Gas Unavailable at Building
                      </Radio>
                    </Box>
                  </Stack>
                </RadioGroup>
                </Stack>
              </Box>
              //*****************
              <Box paddingTop="5pt">
                <Stack isInline align="center">
                  {showInvalidMarkerIfNeeded && !details.internetInRent && (
                    <WarningIcon color="red.500" />
                  )}
                  <Text>
                    Internet
                  </Text>
                <RadioGroup
                  onChange={handleInternetChange}
                  value={details.internetInRent ?? ""}
                >
                  <Stack isInline align="center" spacing={4}>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="YES" bg="gray.200" borderColor="gray.300">
                        Yes
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="NO" bg="gray.200" borderColor="gray.300">
                        No
                      </Radio>
                    </Box>
                  </Stack>
                </RadioGroup>
                </Stack>
              </Box>
              //*****************
              <Box paddingTop="5pt">
                <Stack isInline align="center">
                  {showInvalidMarkerIfNeeded && !details.parkingInRent && (
                    <WarningIcon color="red.500" />
                  )}
                  <Text>
                    Parking
                  </Text>
                <RadioGroup
                  onChange={handleParkingChange}
                  value={details.parkingInRent ?? ""}
                >
                  <Stack isInline align="center" spacing={4}>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="YES" bg="gray.200" borderColor="gray.300">
                        Yes
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="NO" bg="gray.200" borderColor="gray.300">
                        No
                      </Radio>
                    </Box>
                  </Stack>
                </RadioGroup>
                </Stack>
              </Box>
              //*****************
              <Box paddingTop="5pt">
                <Stack isInline align="center">
                  {showInvalidMarkerIfNeeded && !details.otherInRent && (
                    <WarningIcon color="red.500" />
                  )}
                  <Text>
                    Other
                  </Text>
                <RadioGroup
                  onChange={handleOtherChange}
                  value={details.otherInRent ?? ""}
                >
                  <Stack isInline align="center" spacing={4}>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="YES" bg="gray.200" borderColor="gray.300">
                        Yes
                      </Radio>
                    </Box>
                    <Box
                      padding="2pt 4pt"
                      paddingBottom="0pt"
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.100"
                    >
                      <Radio size="sm" value="NO" bg="gray.200" borderColor="gray.300">
                        No
                      </Radio>
                    </Box>
                  </Stack>
                </RadioGroup>
                </Stack>
                {otherInRentField}
              </Box>
              //*****************
            </Stack>
          </FormControl>
          /////////BOTTOM//////////
          <FormControl
            isRequired={true}
            isInvalid={!details.landlord && showValidationErrors}
          >
            <Stack isInline spacing={0}>
              <FormLabel fontSize="sm">Landlord</FormLabel>
              <Tooltip
              marginLeft="50px"
              label="If you are unsure whether to include your landlord or property management company, write in who you would typically contact for a repair. We do not send any assessments to landlords (or anyone).">
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
      </Stack>
    </Box>
  );
};
