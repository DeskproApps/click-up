import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checklists } from "../Checklists";
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
        <Checklists checklists={mockTask.checklists} onCompleteChecklist={jest.fn()}/>
      ), { wrappers: { theme: true }});

      expect(await findByText(/Checklists/i)).toBeInTheDocument();

      expect(await findByText(/BOXES/i)).toBeInTheDocument();
      expect(await findByText(/checklist item1/i)).toBeInTheDocument();
      expect(await findByText(/checklist item2/i)).toBeInTheDocument();

      expect(await findByText(/FOXES/i)).toBeInTheDocument();
      expect(await findByText(/second checklist 1/i)).toBeInTheDocument();
      expect(await findByText(/second checklist 2/i)).toBeInTheDocument();
      expect(await findByText(/second checklist 3/i)).toBeInTheDocument();
    });

    test("should trigger update subtask status", async () => {
      const mockOnCompleteChecklist = jest.fn(() => Promise.resolve());

      const { container } = render((
        <Checklists checklists={mockTask.checklists} onCompleteChecklist={mockOnCompleteChecklist}/>
      ), { wrappers: { theme: true }});

      const checkbox = container.querySelector("input[id=checklist-002-item-3]");

      await userEvent.click(checkbox as Element);

      expect(mockOnCompleteChecklist).toHaveBeenCalledWith("checklist-002", "checklist-002-item-3", true);
    });
  });
});
