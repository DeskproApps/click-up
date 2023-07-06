import { cleanup } from "@testing-library/react";
import { Comments } from "../Comments";
import { render } from "../../../../../testing";
import { mockTaskComments } from "../../../../../testing/mocks";

jest.mock('react-time-ago', () => jest.fn().mockReturnValue('7h 30m'));

describe("ViewTask", () => {
  describe("SubTasks", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Comments comments={mockTaskComments.comments as never} />
      ), { wrappers: { theme: true } });

      expect(await findByText(/Heading one/i)).toBeInTheDocument();
    });
  });
});
