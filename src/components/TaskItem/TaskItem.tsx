import { useMemo, useCallback } from "react";
import get from "lodash/get";
import find from "lodash/find";
import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { useExternalLink } from "../../hooks";
import { format } from "../../utils/date";
import {
  Tag,
  Link,
  Status,
  Member,
  Property,
  ClickUpLogo,
  TextWithLink,
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
  const { getWorkspaceUrl, getProjectUrl } = useExternalLink();
  const tags = useMemo(() => (get(task, ["tags"], []) || []), [task]);
  const assignees = useMemo(() => (get(task, ["assignees"], []) || []), [task]);
  const workspace = useMemo(() => {
    return find(workspaces, { id: get(task, ["team_id"]) });
  }, [workspaces, task]);
  const folder = useMemo(() => {
    if (get(task, ["folder", "hidden"])) {
      return "-";
    }

    const name = get(task, ["folder", "name"]);

    return !name ? "-" : (
      <TextWithLink
        text={name}
        link={getProjectUrl(get(task, ["team_id"]), get(task, ["folder", "id"]))}
      />
    );
  }, [task, getProjectUrl]);

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
        leftText={(
          <TextWithLink
            text={get(workspace, ["name"], "-")}
            link={getWorkspaceUrl(get(task, ["team_id"]))}
          />
        )}
        rightLabel="Project"
        rightText={folder}
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
                  name={get(assignee, ["username"]) || get(assignee, ["email"])}
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
