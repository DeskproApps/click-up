import get from "lodash/get";
import map from "lodash/map";
import size from "lodash/size";
import difference from "lodash/difference";
import isDate from "date-fns/isDate";
import getTime from "date-fns/getTime";
import { z } from "zod";
import { parse } from "../../utils/date";
import type { FormValidationSchema, TaskValues } from "./types";
import type { List, Tag, Task, User } from "../../services/clickUp/types";

const validationSchema = z.object({
  workspace: z.string().nonempty(),
  space: z.string().nonempty(),
  list: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  status: z.string().optional(),
  assignees: z.array(z.number()),
  dueDate: z.date().optional(),
  tags: z.array(z.string()),
});

const getInitValues = (task?: Task): FormValidationSchema => {
  const assignees = get(task, ["assignees"], []);
  const dueDate = get(task, ["due_date"], null);
  const tags = get(task, ["tags"], []);

  return {
    workspace: get(task, ["team_id"], ""),
    space: get(task, ["space", "id"], ""),
    list: get(task, ["list", "id"], ""),
    name: get(task, ["name"], ""),
    description: get(task, ["description"], ""),
    status: get(task, ["status", "status"], ""),
    assignees: !size(assignees) ? [] : assignees.map(({ id }) => id),
    dueDate: !dueDate ? undefined : parse(dueDate),
    tags: !size(tags) ? [] : tags.map(({ name }) => name),
  };
};

const getTaskValues = (values: FormValidationSchema): TaskValues => {
  const description = get(values, ["description"], "");
  const status = get(values, ["status"], "");
  const assignees = get(values, ["assignees"], []);
  const dueDate = get(values, ["dueDate"], "");
  const tags = get(values, ["tags"], []);

  return {
    name: get(values, ["name"]),
    ...(!description ? {} : { description }),
    ...(!status ? {} : { status }),
    ...(!size(assignees) ? {} : { assignees }),
    ...(!isDate(dueDate) ? {} : { due_date: `${getTime(dueDate as Date)}` }),
    ...(!size(tags) ? {} : { tags }),
  };
};

const getListId = (values: FormValidationSchema): List["id"] => {
  return get(values, ["list"]);
};

const getAssigneesToUpdate = (task: Task, values: FormValidationSchema): {
  add: Array<User["id"]>,
  rem: Array<User["id"]>,
} => {
  const taskAssigneeIds = map(get(task, ["assignees"], []), "id");
  const assigneeIds = get(values, ["assignees"], []);

  return {
    add: difference(assigneeIds, taskAssigneeIds),
    rem: difference(taskAssigneeIds, assigneeIds),
  };
};

const getTagsToUpdate = (
  task: Task,
  values: FormValidationSchema,
): {
  add: Array<Tag["name"]>,
  rem: Array<Tag["name"]>,
} => {
  const taskTagIds = map(get(task, ["tags"], []), "name");
  const tagIds = get(values, ["tags"], []);

  return {
    add: difference(tagIds, taskTagIds),
    rem: difference(taskTagIds, tagIds),
  };
};

export {
  getListId,
  getInitValues,
  getTaskValues,
  getTagsToUpdate,
  validationSchema,
  getAssigneesToUpdate,
};
