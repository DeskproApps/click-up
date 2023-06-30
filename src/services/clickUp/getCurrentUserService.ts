import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { User } from "./types";

const getCurrentUserService = (client: IDeskproClient) => {
  return baseRequest<{ user: User }>(client, { url: "/user" });
};

export { getCurrentUserService };
