import size from "lodash/size";
import { Checkbox, Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { NoFound, Container } from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { Subtask } from "../../../services/clickUp/types";

type Props = {
  subTasks: Maybe<Array<Subtask>>,
};

const Subtask: FC<Subtask> = ({ id, name, status }) => {
  return (
    <Checkbox
      id={id}
      key={id}
      size={14}
      label={name}
      containerStyle={{ alignSelf: "start", marginTop: 3, marginRight: 4 }}
      disabled={true}
      checked={["done", "closed"].some((type) => type === status.type)}
    />
  );
};

const SubTasks: FC<Props> = ({ subTasks }) => {
  return (
    <Container>
      <Title title="Subtasks" />

      <Stack vertical gap={10}>
        {(!Array.isArray(subTasks) || !size(subTasks))
          ? <NoFound text="No subtasks found"/>
          : subTasks.map((subTask) => (
            <Subtask key={subTask.id} {...subTask} />
          ))
        }
      </Stack>
    </Container>
  );
};

export { SubTasks };
