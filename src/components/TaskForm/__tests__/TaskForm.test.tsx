import { cleanup, screen, waitFor } from "@testing-library/react";
import { render } from "../../../../testing";
import { TaskForm } from "../TaskForm";
import { useFormDeps } from "../hooks";

jest.mock("../hooks");

describe("LinkTasks", () => {
  const mockFormDeps = {
    isLoading: false,
    workspaceOptions: [],
    spaceOptions: [],
    listOptions: [],
    statusOptions: [],
    userOptions: [],
    tagOptions: []
  }

  beforeEach(() => {
    (useFormDeps as jest.Mock).mockReturnValue(mockFormDeps)
  })

  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  test("render", async () => {
    render(
      <TaskForm onSubmit={jest.fn()} onCancel={jest.fn()} />,
      { wrappers: { theme: true, query: true } }
    );

    await waitFor(() => {
      expect(screen.getByText("Workspace")).toBeInTheDocument()
      expect(screen.getByText("Space")).toBeInTheDocument()
      expect(screen.getByText("List")).toBeInTheDocument()
      expect(screen.getByText("Task name")).toBeInTheDocument()
      expect(screen.getByText("Description")).toBeInTheDocument()
      expect(screen.getByText("Status")).toBeInTheDocument()
      expect(screen.getByText("Assignees")).toBeInTheDocument()
      expect(screen.getByText("Due date")).toBeInTheDocument()
      expect(screen.getByText("Tags")).toBeInTheDocument()
    })

    expect(screen.getByText("Create")).toBeVisible()
    expect(screen.getByText("Cancel")).toBeVisible()
  })

  test("render error", async () => {
    render(
      <TaskForm onSubmit={jest.fn()} error="some error" />,
      { wrappers: { theme: true, query: true } }
    )

    expect(await screen.findByText("some error")).toBeInTheDocument();
  })
})