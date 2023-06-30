import type { To, ParamKeyValuePair } from "react-router-dom";
import type {
  Context,
  IDeskproClient,
  DropdownValueType,
} from "@deskpro/app-sdk";

/** Common types */
export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

/** An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"` */
export type DateTime = string;

/** Request types */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestParams = {
  url?: string,
  rawUrl?: string,
  method?: ApiRequestMethod,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  headers?: Dict<string>,
  queryParams?: string|Dict<string>|ParamKeyValuePair[],
  settings?: Maybe<Settings>,
};

export type Request = <T>(
  client: IDeskproClient,
  params: RequestParams,
) => Promise<{ data: T }>;

/** Deskpro types */
export type Settings = {
  //..
};

export type TicketData = object;

export type TicketContext = Context<TicketData, Maybe<Settings>>;

export type NavigateToChangePage = { type: "changePage", path: To };

export type EventPayload =
  | NavigateToChangePage
  | { type: "logout" }
;

/** Entities */
