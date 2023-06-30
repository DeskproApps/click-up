import { FC } from "react";
import styled from "styled-components";
import {
  ButtonProps,
  AnchorButtonProps,
  Button as ButtonUI,
  AnchorButton as AnchorButtonUI,
} from "@deskpro/deskpro-ui";

export const Button: FC<ButtonProps> = styled(ButtonUI)`
  min-width: 72px;
  justify-content: center;
`;

export const AnchorButton: FC<AnchorButtonProps> = styled(AnchorButtonUI)`
  min-width: 72px;
  justify-content: center;
`;
