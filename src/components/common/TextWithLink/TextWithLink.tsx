import { P5 } from "@deskpro/deskpro-ui";
import { nbsp } from "../../../constants";
import { LinkIcon } from "../Link";
import type { FC } from "react";

type Props = {
  text: string,
  link?: string,
};

const TextWithLink: FC<Props> = ({ text, link }) => {
  return (
    <P5>
      {text}
      {nbsp}
      {link && <LinkIcon href={link}/>}
    </P5>
  );
};

export { TextWithLink };
