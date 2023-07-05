import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import noop from "lodash/noop";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { removeAccessTokenService } from "../services/deskpro";

export type Result = {
  isLoading: boolean,
  logout: () => Promise<unknown>,
};

const useLogout = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = useCallback(() => {
    if (!client) {
      return Promise.resolve();
    }

    setIsLoading(true);

    return removeAccessTokenService(client)
      .catch(noop)
      .finally(() => {
        setIsLoading(false);
        navigate("/login");
      });
  }, [client, navigate]);

  return { logout, isLoading };
};

export { useLogout };
