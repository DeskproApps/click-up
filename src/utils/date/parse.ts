import fnsParse from "date-fns/parse";
import isValid from "date-fns/isValid";
import { API_DATE_FORMAT } from "../../constants";
import type { Maybe } from "../../types";

const parse = (date: Maybe<string>, pattern = API_DATE_FORMAT): Date|undefined => {
  if (!date) {
    return undefined;
  }

  const thisDate = fnsParse(date, pattern, new Date());

  if (!isValid(thisDate)) {
    return undefined;
  }

  return thisDate;
};

export { parse };
