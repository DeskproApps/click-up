import { Container } from "../common";
import { TaskCommentForm } from "../TaskCommentForm";
import type { FC } from "react";
import type { Props as CommentFormProps } from "../TaskCommentForm";

type Props = CommentFormProps;

const CreateTaskComment: FC<Props> = ({ error, onSubmit, onCancel }) => {
  return (
    <Container>
      <TaskCommentForm
        error={error}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Container>
  );
};

export { CreateTaskComment };
