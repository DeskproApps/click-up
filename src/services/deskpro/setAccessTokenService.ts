import { IDeskproClient } from "@deskpro/app-sdk";
import { TOKEN_PATH } from "../../constants";

const setAccessTokenService = (client: IDeskproClient, token: string) => {
  return client.setUserState(TOKEN_PATH, token, { backend: true });
};

export { setAccessTokenService };
