import { baseRequest } from "../baseRequest";
import { addTagToTaskService } from "../addTagToTaskService";
import { removeTagFromTaskService } from "../removeTagFromTaskService";
import { ClickUpError, isAuthError } from "../ClickUpError";
import type { IDeskproClient } from "@deskpro/app-sdk";

const client = {} as IDeskproClient;

describe("ClickUp API compliance", () => {
  const originalFetch = global.fetch;
  const fetchSpy = jest.fn();

  beforeEach(() => {
    fetchSpy.mockReset();
    fetchSpy.mockResolvedValue({ status: 200, json: async () => ({}) });
    global.fetch = fetchSpy;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("should send the OAuth access token as a Bearer token", async () => {
    await baseRequest(client, { url: "/user" });

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];

    expect(options.headers).toMatchObject({
      Authorization: "Bearer [user[oauth2/access_token]]",
    });
  });

  test.each([
    ["add", addTagToTaskService, "POST"],
    ["remove", removeTagFromTaskService, "DELETE"],
  ])("should URL-encode the tag name when %s-ing a task tag", async (_, service, method) => {
    await service(client, "task1", "needs review/QA #1");

    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];

    expect(url.startsWith("https://api.clickup.com/api/v2/task/task1/tag/needs%20review%2FQA%20%231")).toBe(true);
    expect(options.method).toBe(method);
  });

  test.each([
    [new ClickUpError({ status: 401, data: { err: "Oauth token not found", ECODE: "OAUTH_019" } }), true],
    [new ClickUpError({ status: 400, data: { err: "Authorization header required", ECODE: "OAUTH_017" } }), true],
    [new ClickUpError({ status: 404, data: { err: "Task not found", ECODE: "ITEM_015" } }), false],
    [new Error("network"), false],
  ])("isAuthError(%p) should be %p", (error, expected) => {
    expect(isAuthError(error)).toBe(expected);
  });
});
