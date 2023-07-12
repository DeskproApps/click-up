import { getAssigneesToUpdate } from "../utils";

describe("TaskForm", () => {
  describe("getAssigneesToUpdate", () => {
    test("should return assignees to update", () => {
      expect(getAssigneesToUpdate(
        { assignees: [{ id: 123456 }, { id: 654321 }] } as never,
        { assignees: [123456] } as never,
      )).toEqual({ add: [], rem: [654321] });

      expect(getAssigneesToUpdate(
        { assignees: [{ id: 123456 }] } as never,
        { assignees: [654321] } as never,
      )).toEqual({ add: [654321], rem: [123456] });

      expect(getAssigneesToUpdate(
        { assignees: [{ id: 123456 }, { id: 654321 }] } as never,
        { assignees: [123456, 456789] } as never,
      )).toEqual({ add: [456789], rem: [654321] });
    });

    test("should return nothing to update", () => {
      expect(getAssigneesToUpdate(
        { assignees: [] } as never,
        { assignees: [] } as never,
      )).toEqual({ add: [], rem: [] });

      expect(getAssigneesToUpdate(
        { assignees: [{ id: 123456 }, { id: 654321 }] } as never,
        { assignees: [123456, 654321] } as never,
      )).toEqual({ add: [], rem: [] });
    });
  });
});
