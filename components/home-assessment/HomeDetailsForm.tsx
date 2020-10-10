import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Stack,
} from "@chakra-ui/core";
import * as React from "react";
import {
  Landlords,
  LANDLORDS,
  HomeDetails as HomeDetailsType,
  RentalType,
  RENTAL_TYPES,
} from "../../interfaces/home-assessment";
import { validateHomeDetailsForm } from "./helpers/validateHomeDetailsForm";
import { validatePrice } from "./helpers/validatePrice";

type Props = {
  details: Partial<HomeDetailsType>;
  detailsChanged: (
    newDetails: (
      oldDetails: Partial<HomeDetailsType>
    ) => Partial<HomeDetailsType>
  ) => void;
  formHasBeenCompleted: () => void;
};

export const HomeDetailsForm: React.FC<Props> = ({
  details,
  detailsChanged,
  formHasBeenCompleted,
}) => {
  const [showValidationErrors, setShowValidationErrors] = React.useState(false);

  const handleAddressChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;
      detailsChanged((details) => ({
        ...details,
        address: setAsUndefinedInsteadOfEmptyString(value),
      }));
    },
    [detailsChanged]
  );

  const handleRentPriceChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;
      detailsChanged((details) => ({
        ...details,
        totalRent: setAsUndefinedInsteadOfEmptyString(value),
      }));
    },
    [detailsChanged]
  );

  const handleRentalTypeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value as RentalType;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (newValue && !RENTAL_TYPES.includes(newValue))
        throw new Error("invalid rental type");

      detailsChanged((details) => ({
        ...details,
        rentalType: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    [detailsChanged]
  );

  const handleLandlordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value as Landlords;
      // ensure that the selected room type is valid. this should never happen
      // but to be safe...
      if (newValue && !LANDLORDS.includes(newValue))
        throw new Error("invalid rental type");

      detailsChanged((details) => ({
        ...details,
        landlord: setAsUndefinedInsteadOfEmptyString(newValue),
      }));
    },
    [detailsChanged]
  );

  const handleLandlordOtherChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      detailsChanged((details) => ({
        ...details,
        landlordOther: setAsUndefinedInsteadOfEmptyString(event.target.value),
      }));
    },
    [detailsChanged]
  );

  const handleNextButtonClick = React.useCallback(() => {
    if (validateHomeDetailsForm(details)) {
      formHasBeenCompleted();
    } else {
      setShowValidationErrors(true);
    }
  }, [details, formHasBeenCompleted]);

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
            placeholder={"Tina's Properties"}
            size="md"
            value={details.landlordOther}
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
    <Stack padding="4pt">
      <Heading as="h3" size="xs" textTransform="uppercase" marginBottom="8pt">
        Details
      </Heading>
      <Stack isInline>
        <FormControl
          flexBasis={"100%"}
          isInvalid={!details.address && showValidationErrors}
          isRequired={true}
        >
          <FormLabel fontSize="sm">Address</FormLabel>
          <Input
            placeholder={"100 University Av."}
            aria-describedby="address"
            size="md"
            value={details.address ?? ""}
            onChange={handleAddressChange}
          />
          <FormErrorMessage>Please enter a valid address</FormErrorMessage>
        </FormControl>
        <FormControl
          minW={"150px"}
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
      </Stack>
      <Stack isInline>
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
                <Icon name="check" color="green.500" />
              ) : null}
              {details.totalRent && !isTotalRentValid ? (
                <Icon name="not-allowed" color="red.500" />
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
          variantColor="green"
          size="sm"
          marginTop={"16pt"}
          onClick={handleNextButtonClick}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
};

// generic preserves the type inference of union types
function setAsUndefinedInsteadOfEmptyString<T extends string>(value: T) {
  return value === "" ? undefined : value;
}
