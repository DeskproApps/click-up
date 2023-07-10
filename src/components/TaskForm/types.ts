import { z } from "zod";
import { validationSchema } from "./utils";
import type { Maybe } from "../../types";
import type {Task, List, Status, User, Tag} from "../../services/clickUp/types";

export type FormValidationSchema = z.infer<typeof validationSchema>;

export type TaskValues = {
  listId: List["id"],
  name: Task["name"],
  description?: Task["description"]
  status?: Status["id"],
  assignees?: Array<User["id"]>,
  due_date?: Task["due_date"],
  tags?: Array<Tag["name"]>,
};

export type Props = {
  onSubmit: (data: FormValidationSchema) => Promise<void>,
  onCancel?: () => void,
  isEditMode?: boolean,
  task?: Task,
  error?: Maybe<string|string[]>,
};
