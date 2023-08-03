import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import {
  NoFound,
  Container,
  Member,
  ClickUpLogo,
  TwoProperties,
  StatusDropdown,
} from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { Subtask, Status } from "../../../services/clickUp/types";

type Props = {
  subTasks: Maybe<Array<Subtask>>,
  statuses: Status[],
  onChangeSubtaskStatus: (taskId: Subtask["id"], status: Status["status"]) => Promise<void|Subtask>,
};

const Subtask: FC<{ subTask: Subtask } & Omit<Props, "subTasks">> = ({
  subTask,
  statuses,
  onChangeSubtaskStatus,
}) => {
  const assignees = get(subTask, ["assignees"], []) || [];

  return (
    <div style={{ width: "100%" }}>
      <Title
        title={get(subTask, ["name"], "-")}
        icon={<ClickUpLogo/>} link={get(subTask, ["url"], "#") || "#"}
      />
      <TwoProperties
        leftLabel="Status"
        leftText={(
          <StatusDropdown
            statuses={statuses}
            status={get(subTask, ["status"])}
            onChange={(status) => onChangeSubtaskStatus(subTask.id, status)}
          />
        )}
        rightLabel="Assignee(s)"
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

const SubTasks: FC<Props> = ({ subTasks, statuses, onChangeSubtaskStatus }) => {
  return (
    <Container>
      <Title title="Subtasks" />

      <Stack vertical gap={10}>
        {(!Array.isArray(subTasks) || !size(subTasks))
          ? <NoFound text="No subtasks found"/>
          : subTasks.map((subTask, index) => (
            <Fragment key={subTask.id}>
              <Subtask subTask={subTask} statuses={statuses} onChangeSubtaskStatus={onChangeSubtaskStatus} />
              {(size(subTasks) !== index + 1) && <HorizontalDivider style={{ width: "100%" }}/>}
            </Fragment>
          ))
        }
      </Stack>
    </Container>
  );
};

export { SubTasks };
