import { cleanup } from "@testing-library/react";
import { render } from "../../../../../testing";
import { Details } from "../Details";
import { mockTask, mockWorkspaces } from "../../../../../testing/mocks";

describe("ViewTask", () => {
  describe("Details", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const {findByText} = render((
        <Details task={mockTask as never} workspaces={mockWorkspaces.teams as never}/>
      ), {wrappers: {theme: true}});

      expect(await findByText(/Link page/i)).toBeInTheDocument();
      expect(await findByText(/Apps Lab Workspace/i)).toBeInTheDocument();
      expect(await findByText(/Projects/i)).toBeInTheDocument();
      expect(await findByText(/Oh this is linking page/i)).toBeInTheDocument();
      expect(await findByText(/In Progress/i)).toBeInTheDocument();
      expect(await findByText(/30 Jun, 2023/i)).toBeInTheDocument();
      expect(await findByText(/06 Aug, 2023/i)).toBeInTheDocument();
      expect(await findByText(/ilia makarov/i)).toBeInTheDocument();
      expect(await findByText(/development/i)).toBeInTheDocument();
      expect(await findByText(/mvp/i)).toBeInTheDocument();
      expect(await findByText(/screenshot-001.png/i)).toBeInTheDocument();
    });

    test("should display email if there is no user name", async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete mockTask.assignees[0].username;

      const { findByText } = render((
        <Details task={mockTask as never} workspaces={mockWorkspaces.teams as never}/>
      ), { wrappers: { appSdk: true } });

      expect(await findByText(/ilia.makarov@me.com/i)).toBeInTheDocument();
      expect(await findByText(/Daria/i)).toBeInTheDocument();
    });
  });
});
