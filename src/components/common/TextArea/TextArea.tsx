import { forwardRef, Ref } from "react";
import isNumber from "lodash/isNumber";
import styled from "styled-components";
import {
  TextArea as TextAreaUI,
  TextAreaWithDisplayProps,
} from "@deskpro/deskpro-ui";

type Props = TextAreaWithDisplayProps & {
  minHeight?: number | string | "auto",
};

const TextArea = styled(forwardRef(({ minHeight, ...props }: Props, ref: Ref<HTMLTextAreaElement>) =>
  <TextAreaUI {...props} ref={ref} />
))<Props>`
  min-height: ${({ minHeight = 100 }) => isNumber(minHeight) ? `${minHeight}px` : minHeight};
  align-items: flex-start;
`;

export { TextArea };
