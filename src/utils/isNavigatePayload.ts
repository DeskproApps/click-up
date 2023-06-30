import has from "lodash/has";
import type { EventPayload, NavigateToChangePage } from "../types";

const isNavigatePayload = (
  payload: EventPayload
): payload is NavigateToChangePage => {
  return has(payload, ["path"]);
};

export { isNavigatePayload };
