import { getListId } from "../utils";
import values from "./mockFormValues.json";

describe("TaskForm", () => {
  describe("getListId", () => {
    test("should return list id from from values", () => {
      expect(getListId(values as never)).toEqual("list-001");
    });
  });
});
