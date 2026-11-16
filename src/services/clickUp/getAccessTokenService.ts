import { baseRequest } from "./baseRequest";
import { placeholders } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";

const getAccessTokenService = (client: IDeskproClient, code: string) => {
  return baseRequest<AccessToken>(client, {
    url: "/oauth/token",
    method: "POST",
    // Credentials go in the JSON body: the apps proxy rejects backend-only
    // settings (client_secret) in the query string, where they would leak
    // into access logs. ClickUp documents these as body fields.
    data: {
      code,
      client_id: placeholders.CLIENT_ID,
      client_secret: placeholders.CLIENT_SECRET,
    },
  });
};

export { getAccessTokenService };
