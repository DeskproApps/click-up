import { getLinkedMessage, getUnlinkedMessage } from "../../useLinkedAutoComment";

describe("useLinkedAutoComment", () => {
  describe("getLinkedMessage", () => {
    test("should generate message", () => {
      expect(getLinkedMessage("137", "https://some.link"))
        .toEqual("Linked to Deskpro ticket 137, https://some.link")
    });

    test("should generate message without permalink", () => {
      expect(getLinkedMessage("137")).toEqual("Linked to Deskpro ticket 137")
    });
  });

  describe("getUnlinkedMessage", () => {
    test("should generate message", () => {
      expect(getUnlinkedMessage("137", "https://some.link"))
        .toEqual("Unlinked from Deskpro ticket 137, https://some.link")
    });

    test("should generate message without permalink", () => {
      expect(getUnlinkedMessage("137")).toEqual("Unlinked from Deskpro ticket 137")
    });
  });
});
