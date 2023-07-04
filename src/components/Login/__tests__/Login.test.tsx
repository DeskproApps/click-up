import { cleanup } from "@testing-library/react";
import { render } from "../../../../testing";
import { Login } from "../Login";

describe("VerifySettings", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = render((
      <Login isLoading={true} authUrl="" poll={jest.fn()} />
    ), { wrappers: { theme: true }});

    expect(await findByText("Log into your ClickUp Account")).toBeInTheDocument();
    expect(await findByText("Log In")).toBeInTheDocument();
  });

  test("should render link with login url", async () => {
    const { getByRole } = render((
      <Login
        isLoading={false}
        authUrl="https://deskpro.test/callback"
        poll={jest.fn()}
      />
    ), { wrappers: { theme: true }});

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "https://deskpro.test/callback");
  });
});
