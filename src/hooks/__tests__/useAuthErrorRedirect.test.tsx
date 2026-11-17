import { cleanup, renderHook, act } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { notifyAuthError } from "../../services/clickUp/authErrorEvents";
import { useAuthErrorRedirect } from "../useAuthErrorRedirect";
import type { FC, PropsWithChildren } from "react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const renderAt = (path: string) => {
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  );

  return renderHook(() => useAuthErrorRedirect(), { wrapper });
};

describe("useAuthErrorRedirect", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to the login page when ClickUp rejects the token", () => {
    renderAt("/view/task1");

    act(() => notifyAuthError());

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test.each(["/login", "/admin/callback"])("should stay on %s", (path) => {
    renderAt(path);

    act(() => notifyAuthError());

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("should stop listening once unmounted", () => {
    const { unmount } = renderAt("/home");

    unmount();
    notifyAuthError();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
