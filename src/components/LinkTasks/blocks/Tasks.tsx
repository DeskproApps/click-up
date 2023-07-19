import { Fragment } from "react";
import size from "lodash/size";
import { Checkbox } from "@deskpro/deskpro-ui";
import { LoadingSpinner, HorizontalDivider } from "@deskpro/app-sdk";
import { NoFound, Card } from "../../common";
import { TaskItem } from "../../TaskItem";
import type { FC } from "react";
import type { Task, Space, Workspace } from "../../../services/clickUp/types";

type Props = {
  tasks: Task[],
  spaces: Space[],
  isLoading: boolean,
  selectedTasks: Task[],
  workspaces: Workspace[],
  onChangeSelectedTask: (task: Task) => void,
};

const Tasks: FC<Props> = ({
  tasks,
  spaces,
  isLoading,
  workspaces,
  selectedTasks,
  onChangeSelectedTask,
}) => {
  return isLoading
    ? (<LoadingSpinner/>)
    : (
      <>
        {
          !Array.isArray(tasks)
            ? <NoFound/>
            : !size(tasks)
            ? <NoFound text="No ClickUp tasks found"/>
            : tasks.map((task) => (
              <Fragment key={task.id}>
                <Card>
                  <Card.Media>
                    <Checkbox
                      size={12}
                      checked={selectedTasks.some(({ id }) => task.id === id)}
                      onChange={() => onChangeSelectedTask(task)}
                      containerStyle={{ marginTop: 4 }}
                    />
                  </Card.Media>
                  <Card.Body>
                    <TaskItem
                      task={task}
                      spaces={spaces}
                      workspaces={workspaces}
                      onClickTitle={() => onChangeSelectedTask(task)}
                    />
                  </Card.Body>
                </Card>
                <HorizontalDivider style={{ marginBottom: 6 }} />
              </Fragment>
            ))
        }
      </>
  );
};

export { Tasks };
