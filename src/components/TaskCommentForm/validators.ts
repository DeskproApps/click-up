import get from "lodash/get";
import size from "lodash/size";

const noEmptyFormValidator = <T>(values?: T): boolean => {
  const comment = get(values, ["comment"]);
  const attachments = get(values, ["attachments"]);

  return comment || size(attachments);
};

export { noEmptyFormValidator };
