import { cleanup, renderHook, act } from "@testing-library/react";
import { createTaskCommentService } from "../../../services/clickUp";
import { useLinkedAutoComment } from "../../useLinkedAutoComment";
import type { Result } from "../../useLinkedAutoComment";

jest.mock("../../../services/clickUp/createTaskCommentService");

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproLatestAppContext: () => ({
    context: {
      settings: { add_comment_when_linking: false },
      data: {
        ticket: { id: "215", subject: "Big ticket", permalinkUrl: "https://permalink.url" },
      },
    },
  }),
}));

describe("useAutoCommentLinkedIssue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("shouldn't to called the service to create an automatic comment (link issue)", async () => {
    (createTaskCommentService as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

    const { result } = renderHook<Result, unknown>(() => useLinkedAutoComment());

    await act(async () => {
      await result.current.addLinkComment("2-40");
    });

    expect(createTaskCommentService).not.toHaveBeenCalled();
  });

  test("shouldn't to called the service to create an automatic comment (unlink issue)", async () => {
    (createTaskCommentService as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

    const { result } = renderHook<Result, unknown>(() => useLinkedAutoComment());

    await act(async () => {
      await result.current.addUnlinkComment("2-40");
    });

    expect(createTaskCommentService).not.toHaveBeenCalled();
  });
});
