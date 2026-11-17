import { cleanup, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { render } from "../../../../testing";
import { ClickUpError } from "../../../services/clickUp";
import { ErrorFallback } from "../ErrorFallback";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const authError = new ClickUpError({ status: 401, data: { err: "Oauth token not found", ECODE: "OAUTH_019" } });

const renderFallback = (error: unknown, path = "/home") => {
  const resetError = jest.fn();

  render(
    <>{ErrorFallback({ error, resetError, componentStack: "", eventId: "" })}</>,
    { wrappers: { theme: true, router: path } },
  );

  return { resetError };
};

describe("ErrorFallback", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    cleanup();
  });

  test("should send the agent to log in again on an auth error", () => {
    const { resetError } = renderFallback(authError);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(resetError).toHaveBeenCalled();
  });

  test("should show the message for an auth error on the login page", async () => {
    renderFallback(authError, "/login");

    expect(await screen.findByText("Oauth token not found")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("should show the message for other ClickUp errors", async () => {
    const { resetError } = renderFallback(new ClickUpError({ status: 404, data: { err: "Task not found", ECODE: "ITEM_015" } }));

    expect(await screen.findByText("Task not found")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(resetError).not.toHaveBeenCalled();
  });
});
