import { cleanup } from "@testing-library/react";
import { render } from "../../../../testing";
import { getWorkspacesService } from "../../../services/clickUp";
import { TaskForm } from "../TaskForm";


jest.mock("../../../services/clickUp/getWorkspacesService");

describe("LinkTasks", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    (getWorkspacesService as jest.Mock).mockResolvedValue([]);

    const { findByText } = render((
      <TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} />
    ), { wrappers: { theme: true, query: true } });

    expect(await findByText("Workspace")).toBeInTheDocument();
    expect(await findByText("Space")).toBeInTheDocument();
    expect(await findByText("List")).toBeInTheDocument();
    expect(await findByText("Task name")).toBeInTheDocument();
    expect(await findByText("Description")).toBeInTheDocument();
    expect(await findByText("Status")).toBeInTheDocument();
    expect(await findByText("Assignees")).toBeInTheDocument();
    expect(await findByText("Due date")).toBeInTheDocument();
    expect(await findByText("Tags")).toBeInTheDocument();

    expect(await findByText("Create")).toBeVisible();
    expect(await findByText("Cancel")).toBeVisible();
  });

  test("render error", () => {
    const { queryByText } = render((
      <TaskForm onSubmit={jest.fn()} error="some error" />
    ), { wrappers: { theme: true, query: true } });

    expect(queryByText("some error")).toBeInTheDocument();
  });
});
