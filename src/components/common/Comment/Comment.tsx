import React from "react";
import styled from "styled-components";
import ReactTimeAgo from "react-time-ago";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar, TSpan, P11, Stack } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { AnyIcon } from "@deskpro/deskpro-ui";
import type { Maybe } from "../../../types";

const TimeAgo = styled(ReactTimeAgo)`
  color: ${({theme}) => theme.colors.grey80};
`;

const Author = styled(Stack)`
  width: 35px;
`;

const Body = styled(TSpan)`
  width: calc(100% - 35px);
  white-space: pre-line;

  p {
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0;
  }

  p:first-child,
  ol:first-child,
  ul:first-child {
    margin-top: 0;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

type Props = {
  name: string,
  text: string,
  date?: Maybe<Date>,
  avatarUrl?: string,
};

const Comment: FC<Props> = ({ name, avatarUrl, text, date }) => {
  return (
    <Stack wrap="nowrap" gap={6} style={{ marginBottom: 10 }}>
      <Author vertical>
        <Avatar
          size={18}
          name={name}
          backupIcon={faUser as AnyIcon}
          imageUrl={avatarUrl}
        />
        {date && (
          <P11>
            <TimeAgo date={date} timeStyle="mini"/>
          </P11>
        )}
      </Author>
      <Body type="p1">{text}</Body>
    </Stack>
  );
};

export { Comment };
