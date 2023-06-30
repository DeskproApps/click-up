import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import * as React from "react";
import { Main } from "./pages/Main";

function App() {
  return (
    <DeskproAppProvider>
      <Main />
    </DeskproAppProvider>
  );
}

export default App;
