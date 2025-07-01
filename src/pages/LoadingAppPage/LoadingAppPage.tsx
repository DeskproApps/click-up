import { LoadingSpinner, useDeskproElements } from "@deskpro/app-sdk";
import { useEffect, useState, type FC } from "react";
import { Button } from "@deskpro/deskpro-ui";

const LoadingAppPage: FC = () => {

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
  });

  const [errorState, setErrorState] = useState<string | null>(null)

  useEffect(() => {
    if (errorState === "left") {
      throw new Error("hello")
    }

    if (errorState === "right") {
      throw "HI"
    }
  }, [errorState])

  return (
    <>
      <Button
        text="Left Error"
        onClick={() => { setErrorState("left") }}
      />
      <Button
        text="Right Error"
        onClick={() => { setErrorState("right") }}
      />
      <LoadingSpinner />
    </>
  );
};

export { LoadingAppPage };
