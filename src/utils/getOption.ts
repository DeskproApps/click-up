import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Option } from "../types";

const getOption = <Value>(
  value: Value,
  label: DropdownValueType<Value>["label"],
  description?: DropdownValueType<Value>["description"],
): Option<Value> => ({
  label,
  value,
  key: `${value}`,
  type: "value",
  ...(description ? { description } : {}),
});

export { getOption };
