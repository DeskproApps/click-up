import { useMemo, useCallback } from "react";
import get from "lodash/get";
import find from "lodash/find";
import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { format } from "../../utils/date";
import {
  Tag,
  Link,
  Status,
  Member,
  Property,
  ClickUpLogo,
  TwoProperties,
  DeskproTickets,
} from "../common";
import type { FC, MouseEvent } from "react";
import type { Task, Workspace } from "../../services/clickUp/types";

type Props = {
  task: Task,
  workspaces: Workspace[],
  onClickTitle?: () => void,
};

const TaskItem: FC<Props> = ({ task, workspaces, onClickTitle }) => {
  const tags = useMemo(() => (get(task, ["tags"], []) || []), [task]);
  const assignees = useMemo(() => (get(task, ["assignees"], []) || []), [task]);
  const workspace = useMemo(() => {
    return find(workspaces, { id: get(task, ["team_id"]) });
  }, [workspaces, task]);

  const onClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    onClickTitle && onClickTitle();
  }, [onClickTitle]);

  return (
    <>
      <Title
        title={!onClickTitle
          ? task.name
          : (<Link href="#" onClick={onClick}>{task.name}</Link>)
        }
        icon={<ClickUpLogo/>}
        link={get(task, ["url"], "#") || "#"}
        marginBottom={10}
      />
      <TwoProperties
        leftLabel="Workspace"
        leftText={get(workspace, ["name"], "-")}
        rightLabel="Project"
        rightText={get(task, ["project", "name"], "-")}
      />
      <TwoProperties
        leftLabel="Status"
        leftText={<Status status={get(task, ["status"])} />}
        rightLabel="Due Date"
        rightText={format(get(task, ["due_date"]))}
      />
      <Property
        label="Deskpro Tickets"
        text={<DeskproTickets entityId={get(task, ["id"])}/>}
      />
      {Boolean(size(assignees)) && (
        <Property
          label="Assignee"
          text={(
            <Stack gap={6} wrap="wrap">
              {assignees.map((assignee) => (
                <Member
                  key={get(assignee, ["id"])}
                  name={get(assignee, ["username"])}
                  avatarUrl={get(assignee, ["profilePicture"])}
                />
              ))}
            </Stack>
          )}
        />
      )}
      {Boolean(size(tags)) && (
        <Property
          label="Tags"
          text={(
            <Stack gap={6} wrap="wrap">
              {tags.map((tag) => (<Tag key={get(tag, ["name"])} tag={tag} />))}
            </Stack>
          )}
        />
      )}
    </>
  );
};

export { TaskItem };
