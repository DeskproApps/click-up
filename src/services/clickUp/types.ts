import type { Maybe } from "../../types";

export type ClickUpAPIError = {
  error: {
    code: number,
    message: string,
  }
};

export type AccessToken = {
  token_type: "Bearer",
  access_token: string,
};

export type User = {
  id: number,
  username: string,
  initials: string,
  email: string,
  color: string,
  timezone: string,
  profilePicture: Maybe<string>,
  week_start_day: null
  global_font_support: boolean,
};
