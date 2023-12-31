import { cleanup } from "@testing-library/react";
import { SubTasks } from "../SubTasks";
import { render } from "../../../../../testing";
import { mockTask } from "../../../../../testing/mocks";

describe("ViewTask", () => {
  describe("SubTasks", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <SubTasks subTasks={mockTask.subtasks as never} statuses={[]} onChangeSubtaskStatus={jest.fn()}/>
      ), { wrappers: { theme: true } });

      expect(await findByText(/search tasks/i)).toBeInTheDocument();
      expect(await findByText(/linking tasks to the ticket/i)).toBeInTheDocument();
      expect(await findByText(/logout/i)).toBeInTheDocument();
      expect(await findByText(/filtering/i)).toBeInTheDocument();
    });

    test("should show 'No subtasks found' id empty subtasks", async () => {
      const { findByText } = render((
        <SubTasks subTasks={[]} statuses={[]} onChangeSubtaskStatus={jest.fn()}/>
      ), { wrappers: { theme: true }});

      expect(await findByText(/No subtasks found/i)).toBeInTheDocument();
    });
  });
});
