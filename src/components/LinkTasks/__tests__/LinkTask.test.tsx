import { cleanup } from "@testing-library/react";
import { render } from "../../../../testing";
import { LinkTasks } from "../LinkTasks";
import { mockTasks, mockWorkspaces } from "../../../../testing/mocks";

jest.mock("../../common/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>
}));

describe.skip("LinkTask", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = render((
      <LinkTasks
        spaces={[]}
        onChangeSearch={jest.fn()}
        onCancel={jest.fn()}
        onLinkTasks={jest.fn()}
        isSubmitting={false}
        isLoading={false}
        onChangeWorkspace={jest.fn()}
        onChangeSelectedTask={jest.fn()}
        selectedTasks={[]}
        selectedWorkspaceId="team001"
        workspaces={mockWorkspaces.teams as never}
        tasks={mockTasks.tasks as never}
        onNavigateToCreateTask={jest.fn()}
      />
    ), { wrappers: { theme: true } });

    expect(await findByText(/Task 1/i)).toBeInTheDocument();
    expect(await findByText(/Task 2/i)).toBeInTheDocument();
    expect(await findByText(/Task 3/i)).toBeInTheDocument();
    expect(await findByText(/Link page/i)).toBeInTheDocument();
    expect(await findByText(/View page/i)).toBeInTheDocument();
    expect(await findByText(/Home page/i)).toBeInTheDocument();
  });
});
