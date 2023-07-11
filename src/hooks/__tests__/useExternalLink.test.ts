import { cleanup, renderHook } from "@testing-library/react";
import { useExternalLink } from "../useExternalLink";
import type { Result } from "../useExternalLink";

describe("useExternalLink", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should return workspace url", () => {
    const { result } = renderHook<Result, unknown>(() => useExternalLink());

    expect(result.current.getWorkspaceUrl("workspace001")).toBe("https://app.clickup.com/workspace001");
  });

  test("should return project url", () => {
    const { result } = renderHook<Result, unknown>(() => useExternalLink());
    expect(result.current.getProjectUrl("workspace001", "project001"))
      .toBe("https://app.clickup.com/workspace001/v/f/project001");
  });
});
