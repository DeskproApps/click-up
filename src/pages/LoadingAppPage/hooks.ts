import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getCurrentUserService } from "../../services/clickUp";

type UseCheckAuth = () => void;

const useCheckAuth: UseCheckAuth = () => {
  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    getCurrentUserService(client)
      .then(({ user }) => get(user, ["id"]) && navigate("/home"))
      .catch(() => navigate("/login"));
  });
};

export { useCheckAuth };
