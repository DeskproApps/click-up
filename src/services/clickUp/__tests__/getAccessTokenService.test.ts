import { getAccessTokenService } from "../getAccessTokenService";
import type { IDeskproClient } from "@deskpro/app-sdk";

describe("getAccessTokenService", () => {
  const originalFetch = global.fetch;
  const fetchSpy = jest.fn();

  beforeEach(() => {
    fetchSpy.mockReset();
    fetchSpy.mockResolvedValue({
      status: 200,
      json: async () => ({ access_token: "token" }),
    });
    global.fetch = fetchSpy;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("should send credentials in a JSON body, not the query string", async () => {
    const result = await getAccessTokenService({} as IDeskproClient, "abc123");

    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const { search } = new URL(url);

    expect(url.startsWith("https://api.clickup.com/api/v2/oauth/token")).toBe(true);
    expect(search).not.toMatch(/client_secret|client_id|code/);
    expect(options.method).toBe("POST");
    expect(options.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(JSON.parse(options.body as string)).toEqual({
      code: "abc123",
      client_id: "__client_id__",
      client_secret: "__client_secret__",
    });
    expect(result).toEqual({ access_token: "token" });
  });
});
