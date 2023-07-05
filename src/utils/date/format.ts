import { default as fnsFormat } from "date-fns/format";
import { parse } from "./parse";
import { DATE_FORMAT } from "../../constants";
import type { Maybe, Timestamp } from "../../types";

const format = (date: Maybe<Timestamp>, pattern = DATE_FORMAT): string => {
    if (!date) {
        return "-";
    }

    const thisDate = parse(date);

    return !thisDate ? "-" : fnsFormat(thisDate as Date, pattern);
};

export { format };
