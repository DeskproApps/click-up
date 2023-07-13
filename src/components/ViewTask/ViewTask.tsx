import get from "lodash/get";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { Comments, Details, SubTasks, Checklists } from "./blocks";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { Task, Workspace, Comment, CheckList, CheckListItem } from "../../services/clickUp/types";

type Props = {
  task: Maybe<Task>,
  workspaces: Workspace[],
  comments: Comment[],
  onCompleteChecklist: (
    checklistId: CheckList["id"],
    itemId: CheckListItem["id"],
    resolved: boolean,
  ) => Promise<unknown>,
};

const ViewTask: FC<Props> = ({
  task,
  comments,
  workspaces,
  onCompleteChecklist,
}) => {
  return (
    <>
      <Details task={task} workspaces={workspaces} />
      <HorizontalDivider/>
      <SubTasks subTasks={get(task, ["subtasks"])} />
      <HorizontalDivider/>
      <Checklists
        checklists={get(task, ["checklists"])}
        onCompleteChecklist={onCompleteChecklist}
      />
      <HorizontalDivider/>
      <Comments comments={comments} />
    </>
  );
};

export { ViewTask };
