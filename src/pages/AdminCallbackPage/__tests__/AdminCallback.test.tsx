import { cleanup } from "@testing-library/react";
import { render } from "../../../../testing";
import { AdminCallback } from "../AdminCallbackPage";

describe("VerifySettings", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { getByRole, findByText } = render((
      <AdminCallback callbackUrl="https://deskpro.test/callback" />
    ), { wrappers: { theme: true } });

    const callbackInput = getByRole("textbox");

    expect(callbackInput).toHaveValue("https://deskpro.test/callback");
    expect(await findByText(/The callback URL will be required during ClickUp app setup/i)).toBeInTheDocument();
  });

  test("should show the loader if there is no URL", async () => {
    const { findByText } = render((<AdminCallback />), { wrappers: { theme: true } });
    expect(await findByText(/Loading.../i)).toBeInTheDocument();
  });
});
