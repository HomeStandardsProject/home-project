import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useUserStepState } from "../../../hooks/useUserStepState";

export function OverrideAlert() {
  const cancelRef = React.useRef<any>();
  const { hasAssessmentResult } = useUserStepState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  React.useEffect(() => {
    if (hasAssessmentResult) {
      onOpen();
    }
  }, [onOpen, hasAssessmentResult]);

  const handleAbortAction = React.useCallback(() => {
    router.push("/results");
  }, [router]);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Discard Results?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          By continuing your previous results will be lost. Are you sure you
          want to continue?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={handleAbortAction}>Go back</Button>
          <Button ref={cancelRef} colorScheme="red" ml={3} onClick={onClose}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
