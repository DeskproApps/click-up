import { Login } from "../../components";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useLogin } from "./hooks";
import type { FC } from "react";

const LoginPage: FC = () => {
  const { onSignIn, authUrl, isLoading, error } = useLogin();

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
  });

  return (
    <Login poll={onSignIn} authUrl={authUrl} isLoading={isLoading} error={error} />
  );
};

export { LoginPage };
