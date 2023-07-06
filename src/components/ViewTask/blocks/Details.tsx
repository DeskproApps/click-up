import { useMemo } from "react";
import get from "lodash/get";
import find from "lodash/find";
import { P5, Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { useExternalLink } from "../../../hooks";
import { format } from "../../../utils/date";
import {
  Tag,
  Status,
  Member,
  Property,
  ClickUpLogo,
  TextWithLink,
} from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { Task, Workspace } from "../../../services/clickUp/types";

type Props = {
  task: Maybe<Task>,
  workspaces: Workspace[],
}

const Details: FC<Props> = ({ task, workspaces }) => {
  const { getWorkspaceUrl, getProjectUrl } = useExternalLink();
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
        text={(
          <TextWithLink
            text={get(workspace, ["name"], "-")}
            link={getWorkspaceUrl(get(task, ["team_id"], ""))}
          />
        )}
      />
      <Property
        label="Project"
        text={(
          <TextWithLink
            text={get(task, ["project", "name"], "-")}
            link={getProjectUrl(get(task, ["team_id"], ""), get(task, ["project", "id"], ""))}
          />
        )}
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
