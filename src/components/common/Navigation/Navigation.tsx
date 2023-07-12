import noop from "lodash/noop";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TwoButtonGroup, TwoButtonGroupProps } from "@deskpro/app-sdk";
import type { FC } from "react";

type Props = {
  selected: TwoButtonGroupProps["selected"],
  onOneNavigate?: TwoButtonGroupProps["oneOnClick"],
  onTwoNavigate?: TwoButtonGroupProps["twoOnClick"],
};

const Navigation: FC<Props> = ({ selected, onOneNavigate, onTwoNavigate }) => {
  return (
    <TwoButtonGroup
      selected={selected}
      oneLabel="Find Task"
      twoLabel="Create Task"
      oneIcon={faSearch}
      twoIcon={faPlus}
      oneOnClick={onOneNavigate || noop}
      twoOnClick={onTwoNavigate || noop}
    />
  );
};

export { Navigation };
