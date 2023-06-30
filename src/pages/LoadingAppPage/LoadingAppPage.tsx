import { LoadingSpinner, useDeskproElements } from "@deskpro/app-sdk";
import { useCheckAuth } from "./hooks";
import type { FC } from "react";

const LoadingAppPage: FC = () => {
  useCheckAuth();

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
  });

  return (
    <LoadingSpinner/>
  );
};

export { LoadingAppPage };
