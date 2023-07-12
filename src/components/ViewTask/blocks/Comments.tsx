import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import { parse } from "../../../utils/date";
import { Comment } from "../../common";
import type { FC } from "react";
import type { Comment as CommentType } from "../../../services/clickUp/types";

type Props = {
  comments: CommentType[],
};

const Comments: FC<Props> = ({ comments }) => {
  return (
    <>
      <Title title={`Comments (${size(comments)})`}/>

      {comments.map(({ id, comment_text, date, user }) => (
        <Fragment key={id}>
          <Comment
            name={user.username}
            date={parse(date)}
            avatarUrl={get(user, ["profilePicture"]) || ""}
            text={comment_text}
          />
          <HorizontalDivider style={{ marginBottom: 10 }} />
        </Fragment>
      ))}
    </>
  );
};

export { Comments };
