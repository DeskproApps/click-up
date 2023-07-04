import { useNavigate } from 'react-router-dom';
import { act, cleanup, renderHook } from "@testing-library/react";
import { getCurrentUserService } from "../../../services/clickUp";
import { useCheckAuth } from "../hooks";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock("../../../services/clickUp/getCurrentUserService");

describe("VerifySettings", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to /home if token valid", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getCurrentUserService as jest.Mock).mockResolvedValue({ user: { id: "001" } });

    await act(async () => {
      renderHook<void, unknown>(() => useCheckAuth());
    })

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("should navigate to /login if token invalid", async () => {
const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getCurrentUserService as jest.Mock).mockRejectedValue({});

    await act(async () => {
      renderHook<void, unknown>(() => useCheckAuth());
    })

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
