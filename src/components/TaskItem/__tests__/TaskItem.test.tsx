import { cleanup } from "@testing-library/react";
import { TaskItem } from "../TaskItem";
import { render } from "../../../../testing";
import { mockTasks, mockWorkspaces, mockSpace } from "../../../../testing/mocks";

jest.mock("../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

describe("TaskItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = render((
      <TaskItem
        spaces={[mockSpace as never]}
        task={mockTasks.tasks[3] as never}
        workspaces={mockWorkspaces.teams as never}
      />
    ), { wrappers: { appSdk: true } });

    expect(await findByText(/Link/i)).toBeInTheDocument();
    expect(await findByText(/Team Space/i)).toBeInTheDocument();
    expect(await findByText(/Apps Lab Workspace/i)).toBeInTheDocument();
    expect(await findByText(/Projects/i)).toBeInTheDocument();
    expect(await findByText(/DP List One/i)).toBeInTheDocument();
    expect(await findByText(/In Progress/i)).toBeInTheDocument();
    expect(await findByText(/06 Aug, 2023/i)).toBeInTheDocument();
    expect(await findByText(/ilia makarov/i)).toBeInTheDocument();
    expect(await findByText(/100500/i)).toBeInTheDocument();
    expect(await findByText(/development/i)).toBeInTheDocument();
    expect(await findByText(/development/i)).toBeInTheDocument();
  });

  test("should display email if there is no user name", async () => {
    const task = mockTasks.tasks[3];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete task.assignees[0].username;

    const { findByText } = render((
      <TaskItem
        spaces={[]}
        task={mockTasks.tasks[3] as never}
        workspaces={mockWorkspaces.teams as never}
      />
    ), { wrappers: { appSdk: true } });

    expect(await findByText(/ilia.makarov@me.com/i)).toBeInTheDocument();
    expect(await findByText(/Daria/i)).toBeInTheDocument();
  });
});
