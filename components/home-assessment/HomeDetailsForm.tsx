import {
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Stack,
  Text,
} from "@chakra-ui/core";
import * as React from "react";
import {
  Landlords,
  LANDLORDS,
  HomeDetails as HomeDetailsType,
  RentalType,
  RENTAL_TYPES,
} from "../../interfaces/home-assessment";

type Props = {
  details: Partial<HomeDetailsType>;
  detailsChanged: (
    newDetails: (
      oldDetails: Partial<HomeDetailsType>
    ) => Partial<HomeDetailsType>
  ) => void;
};

export const HomeDetailsForm: React.FC<Props> = ({
  details,
  detailsChanged,
}) => {
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

  const isTotalRentValid = React.useMemo(() => {
    if (details.totalRent) {
      // price validator
      const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
      return regex.test(details.totalRent);
    }
    return true;
  }, [details.totalRent]);

  const otherLandlordField = React.useMemo(
    () =>
      details.landlord === "Other" ? (
        <Stack spacing={0} flexBasis={"40%"}>
          <Text as="label" fontSize="sm">
            Other (please specify)
          </Text>
          <Input
            placeholder={"Tina's Properties"}
            aria-describedby="property management company name"
            isRequired={true}
            size="md"
            value={details.landlordOther}
            onChange={handleLandlordOtherChange}
          />
        </Stack>
      ) : null,
    [details.landlord, details.landlordOther, handleLandlordOtherChange]
  );

  return (
    <Stack padding="4pt">
      <Heading as="h3" size="xs" textTransform="uppercase" marginBottom="8pt">
        Details
      </Heading>
      <Stack isInline>
        <Stack spacing={0} flexBasis={"100%"}>
          <Text as="label" fontSize="sm">
            Address
          </Text>
          <Input
            placeholder={"100 University Av."}
            aria-describedby="home address"
            isRequired={true}
            size="md"
            value={details.address ?? ""}
            onChange={handleAddressChange}
          />
        </Stack>
        <Stack spacing={0} minW={"150px"}>
          <Text as="label" fontSize="sm">
            Rental Type
          </Text>
          <Select
            placeholder="Select option"
            size="md"
            isRequired={true}
            value={details.rentalType}
            onChange={handleRentalTypeChange}
          >
            {RENTAL_TYPES.map((houseType) => (
              <option key={houseType} value={houseType}>
                {houseType}
              </option>
            ))}
          </Select>
        </Stack>
      </Stack>
      <Stack isInline>
        <Stack spacing={0}>
          <Text as="label" fontSize="sm">
            Rent cost (including utilities)
          </Text>
          <InputGroup>
            <InputLeftElement color="gray.300">$</InputLeftElement>
            <Input
              placeholder="Enter amount"
              value={details.totalRent ?? ""}
              onChange={handleRentPriceChange}
              isRequired={true}
              isInvalid={!isTotalRentValid}
            />
            <InputRightElement>
              {details.totalRent && isTotalRentValid ? (
                <Icon name="check" color="green.500" />
              ) : null}
              {details.totalRent && !isTotalRentValid ? (
                <Icon name="not-allowed" color="red.500" />
              ) : null}
              {/* <Icon name="not" color="green.500" /> */}
            </InputRightElement>
          </InputGroup>
        </Stack>
        <Stack spacing={0} flexBasis={"40%"}>
          <Text as="label" fontSize="sm">
            Landlord
          </Text>
          <Select
            placeholder="Select option"
            size="md"
            value={details.landlord}
            onChange={handleLandlordChange}
            isRequired={true}
          >
            {LANDLORDS.map((landlord) => (
              <option key={landlord} value={landlord}>
                {landlord}
              </option>
            ))}
          </Select>
        </Stack>
        {otherLandlordField}
      </Stack>
    </Stack>
  );
};

// generic preserves the type inference of union types
function setAsUndefinedInsteadOfEmptyString<T extends string>(value: T) {
  return value === "" ? undefined : value;
}
