import { cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../testing";
import { TaskCommentForm } from "../TaskCommentForm";

describe("TaskCommentForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", () => {
    const { findByText } = render((
      <TaskCommentForm onSubmit={jest.fn()} />
    ), { wrappers: { theme: true } });

    waitFor(async () => {
      expect(await findByText("New comment")).toBeInTheDocument();
      expect(await findByText("Create")).toBeVisible();
      expect(await findByText("Cancel")).toBeVisible();
    });
  });

  test("should should navigate to task details", async () => {
    const mockOnCancel = jest.fn();

    const { findByRole } = render((
      <TaskCommentForm onSubmit={jest.fn()} onCancel={mockOnCancel} />
    ), { wrappers: { theme: true } });

    const cancelButton = await findByRole("button", { name: /Cancel/i });

    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("render error", () => {
    const { findByText } = render((
      <TaskCommentForm onSubmit={jest.fn()} error="some error" />
    ), { wrappers: { theme: true, query: true } });

    waitFor(async () => {
      expect(await findByText("some error")).toBeInTheDocument();
    });
  });
});
