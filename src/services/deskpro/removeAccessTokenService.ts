import { IDeskproClient } from "@deskpro/app-sdk";
import { TOKEN_PATH } from "../../constants";

const removeAccessTokenService = (client: IDeskproClient) => {
  return client.deleteUserState(TOKEN_PATH);
};

export { removeAccessTokenService };
