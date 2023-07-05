import { cleanup, waitFor } from "@testing-library/react";
import { DeskproTickets } from "../DeskproTickets";
import { getEntityAssociationCountService } from "../../../../services/deskpro";
import { render } from "../../../../../testing";

jest.mock("../../../../services/deskpro/getEntityAssociationCountService");

describe("DeskproTickets", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should render count linked entities", async () => {
    (getEntityAssociationCountService as jest.Mock).mockResolvedValue(93);

    const { findByText } = render((
      <DeskproTickets entityId="123"/>
    ), { wrappers: { appSdk: true } });

    expect(await findByText(/93/i)).toBeInTheDocument();
  });

  test("should render zero entities if fetch failed", async () => {
    (getEntityAssociationCountService as jest.Mock).mockRejectedValue(new Error("error"));

    const { findByText } = render((
      <DeskproTickets entityId="123"/>
    ), { wrappers: { appSdk: true } });

    await waitFor(async () => {
      expect(await findByText(/0/i)).toBeInTheDocument();
    });
  });
});
