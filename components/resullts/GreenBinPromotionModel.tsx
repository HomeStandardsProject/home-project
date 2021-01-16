import {
  ModalBody,
  ModalContent,
  Stack,
  Text,
  ModalCloseButton,
  ModalFooter,
  Input,
  FormControl,
  Button,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";
import { useSubmitUserInfo } from "./hooks/useSubmitUserInfo";

type Props = {
  onClose: () => void;
};

export function GreenBinPromotionModel({ onClose }: Props) {
  const toast = useToast();
  const [userInfo, setUserInfo] = React.useState({
    email: "",
    subscribeToNewsletter: false,
  });
  const { submitUserInfo, loading } = useSubmitUserInfo();

  const handleSubmit = React.useCallback(() => {
    const submitAction = async () => {
      const { successful, errors } = await submitUserInfo(userInfo);

      if (successful) {
        onClose();
        toast({
          status: "success",
          description: "All done! You should hear from us shortly.",
        });
        return;
      }

      if (errors) {
        errors.forEach((error) =>
          toast({
            status: "error",
            description: error.msg,
          })
        );
      }
    };
    submitAction();
  }, [toast, userInfo, onClose, submitUserInfo]);

  const handleEmailChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = event.target.value;
      setUserInfo((info) => ({
        ...info,
        email: newEmail,
      }));
    },
    []
  );

  const handleNewsletterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const subcribe = event.target.checked;
      setUserInfo((info) => ({
        ...info,
        subscribeToNewsletter: subcribe,
      }));
    },
    []
  );

  return (
    <ModalContent borderRadius="lg">
      <ModalCloseButton />
      <ModalBody>
        <Stack marginTop={"24pt"}>
          <Text as="b" fontSize="xl" color="gray.700">
            Collect your free Green Bin
          </Text>
          <Text color="gray.700">
            Thank you for completing your home assessment! Enter your email
            below to receive your free Green Bin.
          </Text>
          <Text color="gray.700">
            We&apos;ll reach out with further details from there.
          </Text>
        </Stack>
        <Stack marginTop={"16pt"}>
          <FormControl isRequired>
            <Input
              placeholder="Email"
              variant="filled"
              type="email"
              borderRadius="md"
              value={userInfo.email}
              onChange={handleEmailChange}
            />
          </FormControl>
          <Checkbox
            size="sm"
            isChecked={userInfo.subscribeToNewsletter}
            onChange={handleNewsletterChange}
          >
            Would you like to join our Newsletter?
          </Checkbox>
        </Stack>
      </ModalBody>
      <ModalFooter display="flex" justify="center">
        <Button colorScheme="green" onClick={handleSubmit} isLoading={loading}>
          Submit
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
