import showdown from "showdown";
import styled from "styled-components";
import { TSpan } from "@deskpro/deskpro-ui";
import type { FC } from "react";

type Props = {
    text: string,
};

const converter = new showdown.Converter({
    tables: true,
    tasklists: true,
    strikethrough: true,
    simplifiedAutoLink: true,
    openLinksInNewWindow: true,
});

const MarkdownStyled = styled(TSpan)`
    width: 100%;

    p {
        margin-top: 0;
        white-space: pre-wrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    p:first-child {
        margin-top: 0;
    }

    img {
        width: 100%;
        height: auto;
    }

    a, a:hover {
        color: ${({ theme }) => theme.colors.cyan100};
    }
`;

const Markdown: FC<Props> = ({ text }) => (
    <MarkdownStyled
        type="p5"
        dangerouslySetInnerHTML={{ __html: converter.makeHtml(text) }}
    />
);

export { Markdown };
