import get from "lodash/get";
import { Tag as TagUI } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { Tag as TagType } from "../../../services/clickUp/types";

type Props = {
  tag: TagType
};

const Tag: FC<Props> = ({ tag }) => {
  const name = get(tag, ["name"]);
  const bg = get(tag, ["tag_bg"]);

  if (!name || !bg) {
    return (<>-</>);
  }

  return (
    <TagUI label={name} color={{
      backgroundColor: `${bg}33`, // 20% opacity
      borderColor: bg,
      textColor: bg,
    }} />
  );
};

export { Tag };
