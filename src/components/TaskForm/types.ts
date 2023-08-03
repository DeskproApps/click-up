import { z } from "zod";
import { validationSchema } from "./utils";
import type { Maybe } from "../../types";
import type { Task, Status, User, Tag, Workspace, Space } from "../../services/clickUp/types";

export type FormValidationSchema = z.infer<typeof validationSchema>;

export type TaskValues = {
  name: Task["name"],
  description?: Task["description"]
  status?: Status["id"],
  assignees?: Array<User["id"]>,
  due_date?: Task["due_date"],
  tags?: Array<Tag["name"]>,
};

export type Props = {
  onSubmit: (
    values: FormValidationSchema,
    workspaces: Array<Pick<Workspace, "id"|"name">>,
    spaces: Array<Pick<Space, "id"|"name">>,
  ) => Promise<void>,
  onCancel?: () => void,
  isEditMode?: boolean,
  task?: Task,
  error?: Maybe<string|string[]>,
};
