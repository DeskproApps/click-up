import { isNavigatePayload } from "../isNavigatePayload";

describe("isNavigatePayload", () => {
  test("should navigate payload", () => {
    expect(isNavigatePayload({ type: "changePage", path: "/home" })).toBeTruthy();
    expect(isNavigatePayload({
      type: "changePage",
      path: { pathname: "/view", search: "?foo=bar" },
    })).toBeTruthy();
  });

  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(isNavigatePayload(payload as never)).toBeFalsy();
  });
});
