import styled from "styled-components";
import { Stack } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { Maybe } from "../../../types";

type Props = {
  text?: Maybe<string|JSX.Element|Array<string|JSX.Element>>,
}

const StyledErrorBlock = styled(Stack)`
  width: 100%;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red100};
`;

const ErrorBlock: FC<Props> = ({ text = "An error occurred" }) => (
  <StyledErrorBlock vertical gap={6}>
    {Array.isArray(text)
      ? text.map((msg, idx) => (<div key={idx}>{msg}</div>))
      : text
    }
  </StyledErrorBlock>
);

export { ErrorBlock };
