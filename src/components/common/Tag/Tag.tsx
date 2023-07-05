import get from "lodash/get";
import { Tag as TagUI } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { Tag as TagType } from "../../../services/clickUp/types";

type Props = {
  tag: TagType
};

const Tag: FC<Props> = ({ tag }) => {
  const { theme } = useDeskproAppTheme();
  const name = get(tag, ["name"]);
  const bg = get(tag, ["tag_bg"]);

  if (!name || !bg) {
    return (<>-</>);
  }

  return (
    <TagUI label={name} color={{
      backgroundColor: `${bg}33`, // 20% opacity
      borderColor: theme.colors.white,
      textColor: bg,
    }} />
  );
};

export { Tag };
