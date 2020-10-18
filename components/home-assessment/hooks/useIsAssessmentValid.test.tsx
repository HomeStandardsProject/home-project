import * as React from "react";
import { render } from "@testing-library/react";

import { useIsAssessmentValid } from "./useIsAssessmentValid";
import {
  RoomAssessmentQuestions,
  RoomAssessmentQuestionsContext,
} from "./useRoomAssessmentQuestions";
import { Room } from "../../../interfaces/home-assessment";

const DEFAULT_QUESTIONS: RoomAssessmentQuestions = {
  LIVING: [
    {
      id: "1",
      question: "LIVING 1",
      type: "YES/NO",
      promptForDescriptionOn: "YES",
    },
  ],
  WASH: [
    {
      id: "2",
      question: "WASH 1",
      type: "YES/NO",
      promptForDescriptionOn: "YES",
    },
  ],
  BED: [
    {
      id: "3",
      question: "BED 1",
      type: "YES/NO",
      promptForDescriptionOn: "YES",
    },
  ],
};

const DEFAULT_ROOM: Room = { id: "0", type: "LIVING", responses: {} };

const Component: React.FC<{ rooms: Room[] }> = ({ rooms }) => {
  const [isValid, invalidRoomIds] = useIsAssessmentValid(rooms);

  return (
    <div>
      <div>{isValid ? "valid" : "invalid"}</div>
      <div data-testid="invalid-ids">
        {invalidRoomIds.map((id) => (
          <div key={id}>{`id: ${id}`}</div>
        ))}
      </div>
    </div>
  );
};

describe("useIsAssessmentValid", () => {
  it("it is valid", async () => {
    const rooms: Room[] = [
      {
        ...DEFAULT_ROOM,
        responses: { "1": { answer: "YES", description: undefined } },
      },
    ];

    const { findByText, findByTestId } = render(
      <RoomAssessmentQuestionsContext.Provider value={DEFAULT_QUESTIONS}>
        <Component rooms={rooms} />
      </RoomAssessmentQuestionsContext.Provider>
    );

    expect(await findByText(`valid`)).toBeDefined();

    const invalidIds = await findByTestId(`invalid-ids`);
    expect(invalidIds.children.length).toEqual(0);
  });

  it("is invalid when room has unanswered prompt", async () => {
    const rooms = [{ ...DEFAULT_ROOM, responses: {} }];

    const { findByText, findByTestId } = render(
      <RoomAssessmentQuestionsContext.Provider value={DEFAULT_QUESTIONS}>
        <Component rooms={rooms} />
      </RoomAssessmentQuestionsContext.Provider>
    );

    expect(await findByText(`invalid`)).toBeDefined();

    const invalidIds = await findByTestId(`invalid-ids`);
    expect(invalidIds.children.length).toEqual(1);
    expect(await findByText(`id: 0`)).toBeDefined();
  });

  it("is invalid even room type was changed with answered prompts", async () => {
    const rooms: Room[] = [
      {
        ...DEFAULT_ROOM,
        type: "BED",
        responses: {
          // answer prompt of type "LIVING" then switched to type "BED"
          "1": { answer: "YES", description: undefined },
        },
      },
    ];

    const { findByText, findByTestId } = render(
      <RoomAssessmentQuestionsContext.Provider value={DEFAULT_QUESTIONS}>
        <Component rooms={rooms} />
      </RoomAssessmentQuestionsContext.Provider>
    );

    expect(await findByText(`invalid`)).toBeDefined();

    const invalidIds = await findByTestId(`invalid-ids`);
    expect(invalidIds.children.length).toEqual(1);
    expect(await findByText(`id: 0`)).toBeDefined();
  });

  it("is invalid when room has unanswered prompt in multiple rooms", async () => {
    const rooms = [
      { ...DEFAULT_ROOM, id: "0", responses: {} },
      { ...DEFAULT_ROOM, id: "1", responses: {} },
    ];

    const { findByText, findByTestId } = render(
      <RoomAssessmentQuestionsContext.Provider value={DEFAULT_QUESTIONS}>
        <Component rooms={rooms} />
      </RoomAssessmentQuestionsContext.Provider>
    );

    expect(await findByText(`invalid`)).toBeDefined();

    const invalidIds = await findByTestId(`invalid-ids`);
    expect(invalidIds.children.length).toEqual(2);
    expect(await findByText(`id: 0`)).toBeDefined();
    expect(await findByText(`id: 1`)).toBeDefined();
  });

  it("is invalid when room has unanswered prompt in one room", async () => {
    const rooms: Room[] = [
      { ...DEFAULT_ROOM, id: "0", responses: {} },
      {
        ...DEFAULT_ROOM,
        id: "1",
        responses: { "1": { answer: "YES", description: undefined } },
      },
    ];

    const { findByText, findByTestId } = render(
      <RoomAssessmentQuestionsContext.Provider value={DEFAULT_QUESTIONS}>
        <Component rooms={rooms} />
      </RoomAssessmentQuestionsContext.Provider>
    );

    expect(await findByText(`invalid`)).toBeDefined();

    const invalidIds = await findByTestId(`invalid-ids`);
    expect(invalidIds.children.length).toEqual(1);
    expect(await findByText(`id: 0`)).toBeDefined();
  });
});
