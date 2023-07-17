import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import {
  NoFound,
  Container,
  Status,
  Member,
  ClickUpLogo,
  TwoProperties,
} from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { Subtask, Status as StatusType } from "../../../services/clickUp/types";

type Props = {
  subTasks: Maybe<Array<Subtask>>,
  statuses: StatusType[],
};

const Subtask: FC<{ subTask: Subtask, statuses: StatusType[] }> = ({ subTask }) => {
  const assignees = get(subTask, ["assignees"], []) || [];

  return (
    <div style={{ width: "100%" }}>
      <Title
        title={get(subTask, ["name"], "-")}
        icon={<ClickUpLogo/>} link={get(subTask, ["url"], "#") || "#"}
      />
      <TwoProperties
        leftLabel="Status"
        leftText={<Status status={get(subTask, ["status"])} />}
        rightLabel="Assignee"
        rightText={!size(assignees) ? "-" : (
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
    </div>
  );
};

const SubTasks: FC<Props> = ({ subTasks, statuses }) => {
  return (
    <Container>
      <Title title="Subtasks" />

      <Stack vertical gap={10}>
        {(!Array.isArray(subTasks) || !size(subTasks))
          ? <NoFound text="No subtasks found"/>
          : subTasks.map((subTask, index) => (
            <Fragment key={subTask.id}>
              <Subtask subTask={subTask} statuses={statuses} />
              {(size(subTasks) !== index + 1) && <HorizontalDivider style={{ width: "100%" }}/>}
            </Fragment>
          ))
        }
      </Stack>
    </Container>
  );
};

export { SubTasks };
