import { cleanup } from "@testing-library/react";
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
  });
});
