import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import * as React from "react";
import {
  RoomAssessmentQuestion,
  RoomAssessmentQuestionResponse,
} from "../../../interfaces/home-assessment";
import { setAsUndefinedInsteadOfEmptyString } from "../helpers/setAsUndefinedInsteadOfEmptyString";

type Props = {
  prompt: RoomAssessmentQuestion;
  response: RoomAssessmentQuestionResponse;
  answerChanged: (id: string, response: RoomAssessmentQuestionResponse) => void;
  showInvalidMarkerIfNeeded?: boolean;
};

export const RoomQuestion: React.FC<Props> = ({
  prompt,
  response,
  answerChanged,
  showInvalidMarkerIfNeeded = false,
}) => {
  const handleRadioGroupValueChange = React.useCallback(
    (newValue: string) => {
      if (
        newValue === "YES" ||
        newValue === "NO" ||
        newValue === "UNSURE" ||
        newValue === "NA"
      ) {
        answerChanged(prompt.id, { answer: newValue, description: undefined });
        return;
      }
      throw new Error("unknown option value for prompt");
    },
    [prompt.id, answerChanged]
  );

  const handleDescriptionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = setAsUndefinedInsteadOfEmptyString(event.target.value);
      answerChanged(prompt.id, {
        answer: response.answer,
        description: newValue,
      });
    },
    [answerChanged, response.answer, prompt.id]
  );

  const handleCheckboxChange = React.useCallback(
    (multiselectOption: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      if (newValue) {
        if (!response.selectedMultiselect) {
          answerChanged(prompt.id, {
            answer: response.answer,
            selectedMultiselect: [multiselectOption],
          });
          return;
        }

        if (!response.selectedMultiselect.includes(multiselectOption)) {
          answerChanged(prompt.id, {
            answer: response.answer,
            selectedMultiselect: [
              ...(response.selectedMultiselect ?? []),
              multiselectOption,
            ],
          });
        }
      } else {
        answerChanged(prompt.id, {
          answer: response.answer,
          selectedMultiselect: response.selectedMultiselect?.filter(
            (i) => i !== multiselectOption
          ),
        });
      }
    },
    [response.selectedMultiselect, prompt.id, answerChanged, response.answer]
  );

  return (
    <Box marginBottom='24pt'>
      <Stack isInline align='center'>
        {showInvalidMarkerIfNeeded && !response.answer && (
          <WarningIcon color='red.500' />
        )}
        <Heading as='h5' size='sm' marginBottom='4pt'>
          {prompt.question}
        </Heading>
      </Stack>
      <RadioGroup onChange={handleRadioGroupValueChange} value={response.answer}>
        <Stack isInline align='center' spacing={4}>
          <Box
            padding='2pt 4pt'
            paddingBottom='0pt'
            borderWidth='1px'
            borderRadius='md'
            bg='gray.100'
          >
            <Radio size='sm' value='YES' bg='gray.200' borderColor='gray.300'>
              Yes
            </Radio>
          </Box>
          <Box
            padding='2pt 4pt'
            paddingBottom='0pt'
            borderWidth='1px'
            borderRadius='md'
            bg='gray.100'
          >
            <Radio size='sm' value='NO' bg='gray.200' borderColor='gray.300'>
              No
            </Radio>
          </Box>
          <Box
            padding='2pt 4pt'
            paddingBottom='0pt'
            borderWidth='1px'
            borderRadius='md'
            bg='gray.100'
          >
            <Radio size='sm' value='UNSURE' bg='gray.200' borderColor='gray.300'>
              Unsure
            </Radio>
          </Box>
          <Box
            padding='2pt 4pt'
            paddingBottom='0pt'
            borderWidth='1px'
            borderRadius='md'
            bg='gray.100'
          >
            <Radio size='sm' value='NA' bg='gray.200' borderColor='gray.300'>
              N/A
            </Radio>
          </Box>
        </Stack>
      </RadioGroup>
      {prompt.type === "YES/NO" &&
        response.answer === prompt.promptForDescriptionOn && (
          <Textarea
            data-testid='description-textbox'
            marginTop='4pt'
            placeholder='(Optional) describe the issue...'
            value={response.description}
            onChange={handleDescriptionChange}
          />
        )}
      {prompt.type === "MULTISELECT" &&
        response.answer === prompt.promptForDescriptionOn && (
          <Stack pl={6} mt={1} spacing={1}>
            <Text marginTop='8pt'>Select all that apply:</Text>
            {prompt.multiselectValues?.map((selectionValue) => (
              <Checkbox
                key={selectionValue}
                isChecked={
                  response.selectedMultiselect?.includes(selectionValue) ?? false
                }
                onChange={(e) => handleCheckboxChange(selectionValue, e)}
              >
                {selectionValue}
              </Checkbox>
            ))}
          </Stack>
        )}
    </Box>
  );
};
