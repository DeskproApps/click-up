import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import { default as fnsFormat } from "date-fns/format";
import { DATE_FORMAT } from "../../constants";
import type { Maybe, Timestamp } from "../../types";

const format = (date: Maybe<Timestamp>, pattern = DATE_FORMAT): string => {
    if (!date) {
        return "-";
    }

    const thisDate = parse(date, "T", new Date());

    if (!isValid(thisDate)) {
      return "-";
    }

    return fnsFormat(thisDate as Date, pattern);
};

export { format };
