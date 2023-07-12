import { Container } from "../common";
import { TaskForm } from "../TaskForm";
import type { FC } from "react";
import type { Props as FormProps } from "../TaskForm";

type Props = Omit<FormProps, "onCancel"|"task"> & {
  task: FormProps["task"],
  onCancel: FormProps["onCancel"],
};

const EditTask: FC<Props> = ({ error, onSubmit, onCancel, task }) => {
  return (
    <Container>
      <TaskForm
        isEditMode
        task={task}
        error={error}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Container>
  );
};

export { EditTask };
