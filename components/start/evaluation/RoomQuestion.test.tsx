import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { RoomAssessmentQuestion } from "../../../interfaces/home-assessment";
import { RoomQuestion } from "./RoomQuestion";

const DEFUALT_PROMPT: RoomAssessmentQuestion = {
  id: "1",
  order: null,
  type: "YES/NO",
  question: "Test question",
  promptForDescriptionOn: "YES",
};

const DEFAULT_MULTISELECT_PROMPT: RoomAssessmentQuestion = {
  ...DEFUALT_PROMPT,
  type: "MULTISELECT",
  multiselectValues: ["Apples", "Oranges", "Pears"],
};

describe("RoomQuestion", () => {
  it("displays yes, no, unsure and N/A options when in empty state", () => {
    const { getByLabelText } = render(
      <RoomQuestion
        prompt={DEFUALT_PROMPT}
        response={{}}
        answerChanged={() => {}}
      />
    );
    expect(getByLabelText("Yes")).toBeDefined();
    expect(getByLabelText("No")).toBeDefined();
    expect(getByLabelText("Unsure")).toBeDefined();
    expect(getByLabelText("N/A")).toBeDefined();
  });

  it("selecting an answer triggeres answer changed", () => {
    const answerChanged = jest.fn(() => {});
    const { getByLabelText } = render(
      <RoomQuestion
        prompt={DEFUALT_PROMPT}
        response={{}}
        answerChanged={answerChanged}
      />
    );
    const yesElement = getByLabelText("Yes");
    fireEvent.click(yesElement);

    expect(answerChanged).toHaveBeenCalledWith("1", {
      answer: "YES",
      description: undefined,
    });
  });

  it("displays textbox when promptForDescriptionOn is triggered", () => {
    const { getByTestId } = render(
      <RoomQuestion
        prompt={DEFUALT_PROMPT}
        response={{ answer: "YES", description: "Hello world" }}
        answerChanged={() => {}}
      />
    );
    const textbox = getByTestId("description-textbox") as HTMLTextAreaElement;
    expect(textbox).toBeDefined();
    expect(textbox.value).toBe("Hello world");
  });

  it("triggers answer changed when description changes", () => {
    const answerChanged = jest.fn(() => {});
    const { getByTestId } = render(
      <RoomQuestion
        prompt={DEFUALT_PROMPT}
        response={{ answer: "YES", description: "" }}
        answerChanged={answerChanged}
      />
    );
    const textbox = getByTestId("description-textbox") as HTMLTextAreaElement;
    fireEvent.change(textbox, { target: { value: "a" } });

    expect(answerChanged).toHaveBeenCalledWith("1", {
      answer: "YES",
      description: "a",
    });
  });

  it("displays multiselect when promptForDescriptionOn is triggered", () => {
    const answerChanged = jest.fn(() => {});
    const { getByLabelText } = render(
      <RoomQuestion
        prompt={DEFAULT_MULTISELECT_PROMPT}
        response={{ answer: "YES" }}
        answerChanged={answerChanged}
      />
    );
    expect(getByLabelText("Apples")).toBeDefined();
    expect(getByLabelText("Oranges")).toBeDefined();
    expect(getByLabelText("Pears")).toBeDefined();
  });

  it("triggers answerChanged with new element when a multiselect is newly selected", () => {
    const answerChanged = jest.fn(() => {});
    const { getByLabelText } = render(
      <RoomQuestion
        prompt={DEFAULT_MULTISELECT_PROMPT}
        response={{ answer: "YES" }}
        answerChanged={answerChanged}
      />
    );
    const applesMultiselect = getByLabelText("Apples");
    fireEvent.click(applesMultiselect);
    expect(answerChanged).toHaveBeenCalledWith("1", {
      answer: "YES",
      selectedMultiselect: ["Apples"],
    });
  });

  it("triggers answerChanged with removed element when multiselect is deselected ", () => {
    const answerChanged = jest.fn(() => {});
    const { getByLabelText } = render(
      <RoomQuestion
        prompt={DEFAULT_MULTISELECT_PROMPT}
        response={{ answer: "YES", selectedMultiselect: ["Apples", "Oranges"] }}
        answerChanged={answerChanged}
      />
    );
    const applesMultiselect = getByLabelText("Apples");
    fireEvent.click(applesMultiselect);
    expect(answerChanged).toHaveBeenCalledWith("1", {
      answer: "YES",
      selectedMultiselect: ["Oranges"],
    });
  });

  it("triggers answerChanged with new element when multiselect is selected with existing elements ", () => {
    const answerChanged = jest.fn(() => {});
    const { getByLabelText } = render(
      <RoomQuestion
        prompt={DEFAULT_MULTISELECT_PROMPT}
        response={{ answer: "YES", selectedMultiselect: ["Apples", "Oranges"] }}
        answerChanged={answerChanged}
      />
    );
    const applesMultiselect = getByLabelText("Pears");
    fireEvent.click(applesMultiselect);
    expect(answerChanged).toHaveBeenCalledWith("1", {
      answer: "YES",
      selectedMultiselect: ["Apples", "Oranges", "Pears"],
    });
  });
});
