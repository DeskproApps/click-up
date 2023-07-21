import { isValidElement } from "react";
import styled from "styled-components";
import { P5 } from "@deskpro/app-sdk";
import { TSpan } from "@deskpro/deskpro-ui";
import type { FC, ReactNode } from "react";
import type { Props } from "./types";

const Label = styled(TSpan)`
  color: ${({ theme }) => theme.colors.grey80};
`;

const Container = styled.div<Props>`
  margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const Property: FC<Props> = ({ text, label, marginBottom = 10 }) => {
  let textBlock: ReactNode = (<P5>-</P5>);

  if ((typeof text === "string" || typeof text === "number") && text) {
    textBlock = (<P5>{text}</P5>);
  } else if (isValidElement(text)) {
    textBlock = text;
  }

  return (
    <Container marginBottom={marginBottom}>
      {label && <Label type="p8">{label}</Label>}
      {textBlock && <div>{textBlock}</div>}
    </Container>
  );
}

export { Property };
