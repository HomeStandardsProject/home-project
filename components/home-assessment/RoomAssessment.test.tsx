import * as React from "react";
import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "@chakra-ui/core";

import { Room } from "../../interfaces/home-assessment";
import { RoomAssessment } from "./RoomAssessment";

const DEFAULT_ROOM: Room = {
  id: "id1",
  name: "Room 1",
  type: "BED",
  responses: {},
};

const ControlledRoomAssessment: React.FC = () => {
  const [room, setRoom] = React.useState<Room>(DEFAULT_ROOM);

  const handleRoomName = React.useCallback((name: string | undefined) => {
    setRoom((room) => ({ ...room, name }));
  }, []);

  return (
    <ThemeProvider>
      <div data-testid="room-name">
        room name is {room.name === undefined ? "undefined" : "defined"}
      </div>
      <RoomAssessment
        room={room}
        updateRoomName={handleRoomName}
        updateRoomType={jest.fn()}
        updateQuestion={jest.fn()}
      />
    </ThemeProvider>
  );
};

describe("RoomAssessment", () => {
  it("sets room name to undefined if the room name is undefined on blur", () => {
    const { getByLabelText, getByTestId } = render(
      <ControlledRoomAssessment />
    );

    const input = getByLabelText("Room name") as HTMLInputElement;
    const isRoomNameDefined = getByTestId("room-name");

    expect(isRoomNameDefined.innerHTML).toEqual("room name is defined");

    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");

    fireEvent.blur(input);
    expect(isRoomNameDefined.innerHTML).toEqual("room name is undefined");
  });

  it("does not set room name to undefined if the room name is defined", () => {
    const { getByLabelText, getByTestId } = render(
      <ControlledRoomAssessment />
    );

    const input = getByLabelText("Room name") as HTMLInputElement;
    const isRoomNameDefined = getByTestId("room-name");

    expect(isRoomNameDefined.innerHTML).toEqual("room name is defined");

    fireEvent.change(input, { target: { value: "new name" } });
    expect(input.value).toBe("new name");

    fireEvent.blur(input);
    expect(isRoomNameDefined.innerHTML).toEqual("room name is defined");
  });
});
