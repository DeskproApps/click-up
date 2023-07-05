import { useMemo } from "react";
import get from "lodash/get";
import find from "lodash/find";
import { Stack, P5 } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { format } from "../../../utils/date";
import { Property, ClickUpLogo, Member, Status, Tag } from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { Task, Workspace } from "../../../services/clickUp/types";

type Props = {
  task: Maybe<Task>,
  workspaces: Workspace[],
}

const Details: FC<Props> = ({ task, workspaces }) => {
  const workspace = useMemo(() => {
    return find(workspaces, { id: get(task, ["team_id"]) });
  }, [workspaces, task]);
  const assignees = useMemo(() => (get(task, ["assignees"], []) || []), [task]);
  const tags = useMemo(() => (get(task, ["tags"], []) || []), [task]);

  return (
    <>
      <Title
        title={get(task, ["name"], "-")}
        icon={<ClickUpLogo/>}
        link={get(task, ["url"], "#") || "#"}
        marginBottom={10}
      />
      <Property
        label="Workspace"
        text={get(workspace, ["name"], "-")}
      />
      <Property
        label="Project"
        text={get(task, ["project", "name"], "-")}
      />
      <Property
        label="Description"
        text={(
          <P5 style={{ whiteSpace: "pre-wrap" }}>
            {get(task, ["description"], "-")}
          </P5>
        )}
      />
      <Property
        label="Status"
        text={<Status status={get(task, ["status"])} />}
      />
      <Property
        label="Created at"
        text={format(get(task, ["date_created"]))}
      />
      <Property
        label="Due date"
        text={format(get(task, ["due_date"]))}
      />
      <Property
        label="Assignee(s)"
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
      <Property
        label="Tags"
        text={(
          <Stack gap={6} wrap="wrap">
            {tags.map((tag) => (<Tag key={get(tag, ["name"])} tag={tag} />))}
          </Stack>
        )}
      />
    </>
  );
};

export { Details };
