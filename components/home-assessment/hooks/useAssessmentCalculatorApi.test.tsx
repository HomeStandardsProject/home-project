import * as React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, act, fireEvent, waitFor } from "@testing-library/react";
import { HomeDetails } from "../../../interfaces/home-assessment";
import { NormalizedRoom } from "../helpers/normalizeRooms";
import {
  API_HOME_ASSESSMENT_PATH,
  useAssessmentCalculatorApi,
} from "./useAssessmentCalculatorApi";

const server = setupServer(
  rest.post(API_HOME_ASSESSMENT_PATH, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({}));
  })
);

const DEFAULT_ROOM: NormalizedRoom = {
  id: "0",
  name: "Living room 1",
  type: "LIVING",
  responses: {},
};

const DEFAULT_DETAIL: HomeDetails = {
  landlord: "Frontenac Property Management",
  rentalType: "Full-house",
  totalRent: "499.99",
  address: "99 University Ave, Kingston, ON",
};

const Component: React.FC<{
  rooms: NormalizedRoom[];
  details: Partial<HomeDetails>;
}> = ({ rooms, details }) => {
  const {
    generatingAssessment,
    generateAssessment,
  } = useAssessmentCalculatorApi();
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleClick = async () => {
    const { errors } = await generateAssessment(rooms, details);
    setErrors(errors.map((error) => error.msg));
  };

  return (
    <div>
      <div>{generatingAssessment ? "it is loading" : "it is not loading"}</div>
      <button onClick={handleClick}>Generate</button>
      <div data-testid="errors">
        {errors.map((error, i) => (
          <div key={i}>{error}</div>
        ))}
      </div>
    </div>
  );
};

describe("useAssessmentCalculatorApi", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("transitions the loading state on generation", async () => {
    const { getByText } = render(
      <Component rooms={[DEFAULT_ROOM]} details={DEFAULT_DETAIL} />
    );

    expect(getByText("it is not loading")).toBeDefined();
    const button = getByText("Generate");
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => expect(getByText("it is not loading")).toBeDefined());
  });

  it("does not return any errors on 200", async () => {
    const { getByText, getByTestId } = render(
      <Component rooms={[DEFAULT_ROOM]} details={DEFAULT_DETAIL} />
    );

    expect(getByText("it is not loading")).toBeDefined();
    const button = getByText("Generate");
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => expect(getByText("it is not loading")).toBeDefined());
    const errorsContainer = getByTestId("errors");
    expect(errorsContainer.children.length).toBe(0);
  });

  it("stores result in local storage on success", async () => {
    const { getByText } = render(
      <Component rooms={[DEFAULT_ROOM]} details={DEFAULT_DETAIL} />
    );

    const button = getByText("Generate");
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => expect(getByText("it is not loading")).toBeDefined());
    expect(localStorage.getItem("assessment")).toEqual("{}");
  });

  it("returns error messages when in the correct format", async () => {
    server.use(
      rest.post(API_HOME_ASSESSMENT_PATH, (_, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ errors: [{ msg: "Error #1" }, { msg: "Error #2" }] })
        );
      })
    );

    const { getByText, getByTestId } = render(
      <Component rooms={[DEFAULT_ROOM]} details={DEFAULT_DETAIL} />
    );

    const button = getByText("Generate");
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => expect(getByText("it is not loading")).toBeDefined());
    const errorsContainer = getByTestId("errors");
    expect(errorsContainer.children.length).toBe(2);
    expect(getByText("Error #1")).toBeDefined();
    expect(getByText("Error #2")).toBeDefined();
  });

  it("returns an unknown error message when in the wrong format", async () => {
    server.use(
      rest.post(API_HOME_ASSESSMENT_PATH, (_, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ error: "Something went wrong..." })
        );
      })
    );

    const { getByText, getByTestId } = render(
      <Component rooms={[DEFAULT_ROOM]} details={DEFAULT_DETAIL} />
    );

    const button = getByText("Generate");
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => expect(getByText("it is not loading")).toBeDefined());
    const errorsContainer = getByTestId("errors");
    expect(errorsContainer.children.length).toBe(1);
    expect(getByText("An unknown error occurred...")).toBeDefined();
  });
});
