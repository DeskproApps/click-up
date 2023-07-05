import get from "lodash/get";
import { Pill } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { Status as StatusType } from "../../../services/clickUp/types";

type Props = {
  status?: StatusType,
};

const Status: FC<Props> = ({ status }) => {
  const { theme } = useDeskproAppTheme();
  const color = get(status, ["color"]);
  const name = get(status, ["status"]);

  if (!color || !name) {
    return (<>-</>);
  }

  return (
      <Pill
        label={name}
        textColor={theme.colors.white}
        backgroundColor={color}
      />
    );
};

export { Status };
