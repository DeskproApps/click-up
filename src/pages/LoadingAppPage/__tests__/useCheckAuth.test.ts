import { useNavigate } from 'react-router-dom';
import { act, cleanup, renderHook } from "@testing-library/react";
import { getEntityListService } from "../../../services/deskpro";
import { getCurrentUserService } from "../../../services/clickUp";
import { useCheckAuth } from "../hooks";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock("../../../services/clickUp/getCurrentUserService");
jest.mock("../../../services/deskpro/getEntityListService");

describe("VerifySettings", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to /home if token valid", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getCurrentUserService as jest.Mock).mockResolvedValue({ user: { id: "001" } });
    (getEntityListService as jest.Mock).mockResolvedValue(["001"]);

    await act(async () => {
      renderHook<void, unknown>(() => useCheckAuth());
    })

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("should navigate to /link if token valid and empty linked tasks", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getCurrentUserService as jest.Mock).mockResolvedValue({ user: { id: "001" } });
    (getEntityListService as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      renderHook<void, unknown>(() => useCheckAuth());
    })

    expect(mockNavigate).toHaveBeenCalledWith("/link");
  });

  test("should navigate to /login if token invalid", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getCurrentUserService as jest.Mock).mockRejectedValue({});
    (getEntityListService as jest.Mock).mockResolvedValue(["001"]);

    await act(async () => {
      renderHook<void, unknown>(() => useCheckAuth());
    })

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
