import { useState, useCallback, useEffect } from "react";
import { faSearch, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, IconButton } from "@deskpro/deskpro-ui";
import { Label } from "../Label";
import type { FC, ChangeEvent } from "react";
import type { AnyIcon } from "@deskpro/deskpro-ui";

export type Props = {
  label?: string,
  onChange?: (search: string) => void,
  disabled?: boolean,
  required?: boolean,
  isFetching?: boolean,
};

const Search: FC<Props> = ({
  label,
  onChange,
  disabled = false,
  required = false,
  isFetching = false,
}) => {
  const [search, setSearch] = useState<string>("");

  const onChangeSearch = useCallback(({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
    setSearch(q);
  }, []);

  const onClearSearch = useCallback(() => {
    setSearch("");
  }, []);

  useEffect(() => {
    onChange && onChange(search);
  }, [search, onChange]);

  return (
    <Label
      required={required}
      label={label}
      htmlFor="search"
    >
      <Input
        id="search"
        name="search"
        value={search}
        disabled={disabled}
        onChange={onChangeSearch}
        leftIcon={isFetching
          ? <FontAwesomeIcon icon={faSpinner as never} spin/>
          : faSearch as AnyIcon
        }
        rightIcon={(
          <IconButton icon={faTimes} minimal onClick={onClearSearch} />
        )}
      />
    </Label>
  );
}

export { Search };
