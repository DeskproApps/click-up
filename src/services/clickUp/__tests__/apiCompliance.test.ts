import { baseRequest } from "../baseRequest";
import { addTagToTaskService } from "../addTagToTaskService";
import { removeTagFromTaskService } from "../removeTagFromTaskService";
import { ClickUpError, isAuthError } from "../ClickUpError";
import { onAuthError } from "../authErrorEvents";
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

  test("should turn a plain-text error response into a ClickUpError", async () => {
    fetchSpy.mockResolvedValue({ status: 404, statusText: "Not Found", text: async () => "404 page not found\n" });

    await expect(addTagToTaskService(client, "task1", "a/b")).rejects.toMatchObject({
      status: 404,
      data: { err: "404 page not found" },
    });
  });

  test("should keep the JSON body of an error response", async () => {
    fetchSpy.mockResolvedValue({
      status: 401,
      text: async () => JSON.stringify({ err: "Oauth token not found", ECODE: "OAUTH_019" }),
    });

    await expect(baseRequest(client, { url: "/user" })).rejects.toMatchObject({
      status: 401,
      data: { err: "Oauth token not found", ECODE: "OAUTH_019" },
    });
  });

  test.each([
    [401, JSON.stringify({ err: "Oauth token not found", ECODE: "OAUTH_019" }), 1],
    [400, JSON.stringify({ err: "Authorization header required", ECODE: "OAUTH_017" }), 1],
    [404, "404 page not found", 0],
  ])("should notify auth error listeners for a %p response only when the token is rejected", async (status, body, calls) => {
    const listener = jest.fn();
    const unsubscribe = onAuthError(listener);
    fetchSpy.mockResolvedValue({ status, text: async () => body });

    await expect(baseRequest(client, { url: "/user" })).rejects.toBeInstanceOf(ClickUpError);
    unsubscribe();

    expect(listener).toHaveBeenCalledTimes(calls);
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
