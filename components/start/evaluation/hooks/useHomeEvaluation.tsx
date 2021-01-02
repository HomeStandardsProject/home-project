import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  GENERAL_ROOM_TYPES,
  HomeEvaluationData,
  isGeneralRoomType,
  Room,
  RoomAssessmentQuestionResponse,
  RoomTypes,
} from "../../../../interfaces/home-assessment";
import { normalizeRoomNames } from "../helpers/normalizeRooms";
import { sortRoomsBasedOnTypeAndName } from "../helpers/sortRoomsBasedOnTypeAndName";

const generateDefaultRoom = (): Room => ({
  id: uuidv4(),
  type: "WASH",
  responses: {},
});

const generalInitialRooms = GENERAL_ROOM_TYPES.map(
  (type): Room => ({ id: `default-${type}`, type, responses: {} })
);

export const INITIAL_STATE = ((): HomeEvaluationData => {
  const defaultRoom = generateDefaultRoom();
  return {
    step: "general",
    rooms: [...generalInitialRooms, defaultRoom],
    selectedRoomId: defaultRoom.id,
  };
})();

export const HomeEvaluationState = React.createContext<
  HomeEvaluationData | undefined
>(undefined);

export const HomeEvaluationMutator = React.createContext<
  | ((setter: (data: HomeEvaluationData) => HomeEvaluationData) => void)
  | undefined
>(undefined);

export const useRoomFromId = (id: string) => {
  const state = React.useContext(HomeEvaluationState);
  if (!state) {
    throw new Error("HomeEvaluationState is not within the tree.");
  }
  const mutator = React.useContext(HomeEvaluationMutator);
  if (!mutator) {
    throw new Error("HomeEvaluationMutator is not within the tree");
  }

  const setResponseAnswer = React.useCallback(
    (promptId: string, response: RoomAssessmentQuestionResponse) => {
      mutator((data) => {
        const newRooms = data.rooms.map((room) => {
          if (room.id === id) {
            return {
              ...room,
              responses: { ...room.responses, [promptId]: response },
            };
          }
          return room;
        });
        return { ...data, rooms: newRooms };
      });
    },
    [id, mutator]
  );

  const room = React.useMemo(() => {
    return state.rooms.find((room) => room.id === id);
  }, [state.rooms, id]);

  return { room, setResponseAnswer };
};

export const useRooms = () => {
  const state = React.useContext(HomeEvaluationState);
  if (!state) {
    throw new Error("HomeEvaluationState is not within the tree.");
  }

  const mutator = React.useContext(HomeEvaluationMutator);
  if (!mutator) {
    throw new Error("HomeEvaluationMutator is not within the tree");
  }

  const normalizedAndSortedRooms = React.useMemo(() => {
    const filterRooms = state.rooms.filter(
      (room) => !isGeneralRoomType(room.type)
    );
    const sortedRooms = sortRoomsBasedOnTypeAndName(filterRooms);
    return normalizeRoomNames(sortedRooms);
  }, [state.rooms]);

  const changeSelectedRoom = React.useCallback(
    (id: string) => {
      mutator((data) => ({ ...data, selectedRoomId: id }));
    },
    [mutator]
  );

  const changeRoomType = React.useCallback(
    (newType: RoomTypes) => {
      mutator((data) => {
        const newRooms = data.rooms.map((room) => {
          if (room.id === data.selectedRoomId) {
            return { ...room, type: newType };
          }
          return room;
        });

        return { ...data, rooms: newRooms };
      });
    },
    [mutator]
  );

  const addRoom = React.useCallback(() => {
    const newRoom = generateDefaultRoom();
    mutator((data) => ({
      ...data,
      selectedRoomId: newRoom.id,
      rooms: [...data.rooms, newRoom],
    }));
  }, [mutator]);

  const changeName = React.useCallback(
    (newName) => {
      mutator((data) => {
        const newRooms = data.rooms.map((room) => {
          if (room.id === data.selectedRoomId) {
            return { ...room, name: newName };
          }
          return room;
        });

        return { ...data, rooms: newRooms };
      });
    },
    [mutator]
  );

  const deleteRoom = React.useCallback(
    (idToDelete: string) => {
      mutator((data) => {
        if (data.rooms.length <= 1) {
          console.error("invalid state. unable to delete only remaining room");
          return data;
        }

        const newRooms = data.rooms.filter((room) => room.id !== idToDelete);

        const newSelectedRoomId =
          data.selectedRoomId === idToDelete
            ? newRooms[0].id
            : data.selectedRoomId;

        return {
          ...data,
          selectedRoomId: newSelectedRoomId,
          rooms: newRooms,
        };
      });
    },
    [mutator]
  );

  return {
    rooms: normalizedAndSortedRooms,
    selectedRoomId: state.selectedRoomId,
    changeSelectedRoom,
    addRoom,
    changeRoomType,
    changeName,
    deleteRoom,
  };
};
