import { cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Comments } from "../Comments";
import { render } from "../../../../../testing";
import { mockTaskComments } from "../../../../../testing/mocks";

jest.mock('react-time-ago', () => jest.fn().mockReturnValue('7h 30m'));

describe("ViewTask", () => {
  describe("Comments", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Comments
          comments={mockTaskComments.comments as never}
          onNavigateToAddComment={jest.fn()}
        />
      ), { wrappers: { theme: true } });

      expect(await findByText(/Heading one/i)).toBeInTheDocument();
    });

    test("empty comments", async () => {
      const { findByText } = render((
        <Comments comments={[]} onNavigateToAddComment={jest.fn()} />
      ), { wrappers: { theme: true } });

      expect(await findByText(/Comments \(0\)/i)).toBeInTheDocument();
    });

    test("should navigate to add new comments", async () => {
      const mockOnNavigateToAddComment = jest.fn();

      const { findByRole } = render((
        <Comments comments={[]} onNavigateToAddComment={mockOnNavigateToAddComment} />
      ), { wrappers: { theme: true } });

      const navigateButton = await findByRole("button");

      await act(async () => {
        await userEvent.click(navigateButton as Element);
      });

      expect(mockOnNavigateToAddComment).toHaveBeenCalledTimes(1);
    });
  });
});
