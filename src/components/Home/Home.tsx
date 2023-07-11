import { Fragment } from "react";
import size from "lodash/size";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { NoFound, Container } from "../common";
import { TaskItem } from "../TaskItem";
import type { FC } from "react";
import type { Task, Workspace } from "../../services/clickUp/types";

type Props = {
  tasks: Task[],
  workspaces: Workspace[],
  onNavigateToTask: (taskId: Task["id"]) => void,
};

const Home: FC<Props> = ({ tasks, workspaces, onNavigateToTask }) => {
  return (
    <Container>
      {!Array.isArray(tasks)
        ? <NoFound/>
        : !size(tasks)
          ? <NoFound text="No ClickUp tasks found"/>
          : tasks.map((task) => (
            <Fragment key={task.id}>
              <TaskItem
                task={task}
                workspaces={workspaces}
                onClickTitle={() => onNavigateToTask(task.id)}
              />
              <HorizontalDivider style={{ marginTop: 10, marginBottom: 10 }}/>
            </Fragment>
          ))
      }
    </Container>
  );
};

export { Home };
