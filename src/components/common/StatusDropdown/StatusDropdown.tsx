import { useMemo, useState } from "react";
import get from "lodash/get";
import startCase from "lodash/startCase";
import { faCheck, faChevronDown, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { P5, Dropdown, RoundedLabelTag, Spinner, AnchorButton } from "@deskpro/deskpro-ui";
import { nbsp } from "../../../constants";
import { getOption } from "../../../utils";
import type { FC, ReactNode } from "react";
import type { AnyIcon, DropdownTargetProps, DropdownItemType } from "@deskpro/deskpro-ui";
import type { Status } from "../../../services/clickUp/types";

type Props = {
  status?: Status,
  statuses?: Status[],
  onChange?: (status: Status["status"]) => Promise<unknown>,
};

const NoStatus = () => <P5>-</P5>;

const LoadingStatus = () => (
  <div style={{ width: "16px", height: "16px" }}>
    <Spinner size="extra-small"/>
  </div>
);

const StatusDropdown: FC<Props> = ({ status, statuses, onChange }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const name = get(status, ["status"]);
  const color = get(status, ["color"]);
  const options: Array<DropdownItemType<Status["id"]>> = useMemo(() => {
    return !Array.isArray(statuses)
      ? [{ type: "header", label: "No items(s) found" }]
      : statuses.map(({ status, color }) => getOption(status, (
        <RoundedLabelTag
          key={status}
          label={`${nbsp}${startCase(status)}${nbsp}`}
          backgroundColor={`${color}44`}
          textColor="#777"
        />
      )));
  }, [statuses]);

  if (!name || !color) {
    return (<NoStatus/>);
  }

  return (
    <Dropdown
      options={options}
      fetchMoreText={"Fetch more"}
      autoscrollText={"Autoscroll"}
      externalLinkIcon={faExternalLinkAlt as AnyIcon}
      selectedIcon={faCheck as AnyIcon}
      onSelectOption={({ value }) => {
        if (onChange) {
          setIsLoading(true);
          onChange(value).finally(() => setIsLoading(false));
        }
      }}
    >
      {({ targetProps, targetRef }: DropdownTargetProps<HTMLAnchorElement>) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /* @ts-ignore */
        <AnchorButton
          ref={targetRef}
          intent="minimal"
          disabled={isLoading}
          text={(
            <RoundedLabelTag
              label={`${nbsp}${startCase(name)}`}
              backgroundColor={`${color}44`}
              textColor="#777"
              withClose
              closeIcon={isLoading ? (<LoadingStatus/>) : faChevronDown as AnyIcon}
            />
          ) as ReactNode}
          {...targetProps}
        />
      )}
    </Dropdown>
  );
};

export { StatusDropdown };
