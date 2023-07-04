import { useDeskproElements } from "@deskpro/app-sdk";
import { useLogin } from "./hooks";
import { Login } from "../../components";
import type { FC } from "react";

const LoginPage: FC = () => {
  const { poll, authUrl, isLoading } = useLogin();

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
  });

  return (
    <Login poll={poll} authUrl={authUrl} isLoading={isLoading} />
  );
};

export { LoginPage };
