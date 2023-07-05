import get from "lodash/get";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "../common";
import { Comments, Details, SubTasks } from "./blocks";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { Task, Workspace, Comment } from "../../services/clickUp/types";

type Props = {
  task: Maybe<Task>,
  workspaces: Workspace[],
  comments: Comment[],
};

const ViewTask: FC<Props> = ({ task, workspaces, comments }) => {
  return (
    <>
      <Container>
        <Details task={task} workspaces={workspaces} />
      </Container>
      <HorizontalDivider/>
      <Container>
        <SubTasks subTasks={get(task, ["subtasks"])} />
      </Container>
      <HorizontalDivider/>
      <Container>
        <Comments comments={comments} />
      </Container>
    </>
  );
};

export { ViewTask };
