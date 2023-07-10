import { useState, useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import trim from "lodash/trim";
import isString from "lodash/isString";
import toLower from "lodash/toLower";
import isEmpty from "lodash/isEmpty";
import {
  faCheck,
  faCaretDown,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Stack, DivAsInput, Dropdown } from "@deskpro/deskpro-ui";
import type { ReactNode } from "react";
import type {
  AnyIcon,
  LabelProps,
  DropdownProps,
  DropdownItemType,
  DropdownTargetProps,
  DivAsInputWithDisplayProps,
} from "@deskpro/deskpro-ui";
import type { Option, Maybe } from "../../../types";

type Props<T> = Pick<DropdownProps<T, HTMLElement>, "closeOnSelect"|"containerHeight"|"containerMaxHeight"|"placement"|"disabled"> & {
  id: string,
  error?: DivAsInputWithDisplayProps["error"],
  value: Maybe<T | T[]>,
  options: Option<T>[],
  onChange: (o: Option<T>) => void,
  placeholder?: DivAsInputWithDisplayProps["placeholder"],
  showInternalSearch?: boolean,
  required?: LabelProps["required"],
  noFoundText?: string,
};

const Select = <T,>({
  id,
  error,
  value,
  options,
  onChange,
  disabled,
  required,
  noFoundText,
  placeholder,
  showInternalSearch,
  ...props
}: Props<T>) => {
  const [input, setInput] = useState<string>("");

  const displayValue = useMemo(() => {
    if (Array.isArray(value)) {
      const filteredOptions = options
        .filter((o) => value.includes(o.value))
        .map((o) => o.label);

      if (!size(value)) {
        return "";
      }

      if (isString(get(filteredOptions, [0]))) {
        return filteredOptions.join(", ");
      }

      return filteredOptions;
    } else {
      const o = options.find((o) => o.value === value);
      return get(o, ["label"], value);
    }
  }, [value, options]) as ReactNode;

  const currentOptions = useMemo(() => {
    if (!size(options)) {
      return [{ type: "header", label: noFoundText || "No items(s) found" }];
    }


    return options
      .filter((o) => {
        const label = get(o, ["label"]);
        const description = get(o, ["description"]);
        const search = (!isString(label) && !isEmpty(description)) ? description : label;

        return toLower(search as string).includes(input.toLowerCase())
      })
      .map((o) => ({
        ...o,
        selected: Array.isArray(value)
          ? value.includes(o.value)
          : o.value === value,
      }));
  }, [options, value, input, noFoundText]) as Array<DropdownItemType<T>>;

  return (
    <Dropdown
      disabled={disabled}
      showInternalSearch={showInternalSearch}
      fetchMoreText={"Fetch more"}
      autoscrollText={"Autoscroll"}
      selectedIcon={faCheck as AnyIcon}
      externalLinkIcon={faExternalLinkAlt as AnyIcon}
      placement="bottom-start"
      hideIcons
      inputValue={input}
      onSelectOption={(selectedOption) => {
        setInput("");
        onChange(selectedOption);
      }}
      onInputChange={(value) => {
        if (showInternalSearch) {
          setInput(value);
        }
      }}
      options={currentOptions}
      {...props}
    >
      {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => (
        <DivAsInput
          id={id}
          placeholder={placeholder || "Select Value"}
          variant="inline"
          rightIcon={faCaretDown as AnyIcon}
          error={error}
          ref={targetRef}
          {...targetProps}
          value={isString(displayValue) ? trim(displayValue) : (
            <Stack gap={6} wrap="wrap" style={{ marginBottom: 6 }}>{displayValue}</Stack>
          )}
          style={{ paddingRight: 0, cursor: !disabled ? "pointer" : "not-allowed" }}
        />
      )}
    </Dropdown>
  );
};

export { Select };
