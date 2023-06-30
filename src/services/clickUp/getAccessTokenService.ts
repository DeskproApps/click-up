import { baseRequest } from "./baseRequest";
import { placeholders } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";

const getAccessTokenService = (client: IDeskproClient, code: string) => {
  return baseRequest<AccessToken>(client, {
    url: "/oauth/token",
    method: "POST",
    queryParams: [
      `code=${code}`,
      `client_id=${placeholders.CLIENT_ID}`,
      `client_secret=${placeholders.CLIENT_SECRET}`,
    ].join("&"),
  });
};

export { getAccessTokenService };
