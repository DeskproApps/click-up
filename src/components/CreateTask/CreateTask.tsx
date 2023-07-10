import {
  Container,
  Navigation,
} from "../common";
import { TaskForm } from "../TaskForm";
import type { FC } from "react";
import type { Props as FormProps } from "../TaskForm";

type Props = FormProps & {
  onNavigateToLinkTask: () => void,
};

const CreateTask: FC<Props> = ({
  error,
  onSubmit,
  onNavigateToLinkTask,
}) => {
  return (
    <>
      <Container>
        <Navigation selected="two" onOneNavigate={onNavigateToLinkTask} />
        <TaskForm onSubmit={onSubmit} error={error} />
      </Container>
    </>
  );
};

export { CreateTask };
