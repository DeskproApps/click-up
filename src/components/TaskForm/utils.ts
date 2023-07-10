import get from "lodash/get";
import size from "lodash/size";
import isDate from "date-fns/isDate";
import getTime from "date-fns/getTime";
import { z } from "zod";
import type { FormValidationSchema, TaskValues } from "./types";

const validationSchema = z.object({
  workspace: z.string().nonempty(),
  space: z.string().nonempty(),
  list: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  status: z.string().optional(),
  assignee: z.number().optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()),
});

const getInitValues = (): FormValidationSchema => {
  return {
    workspace: "",
    space: "",
    list: "",
    name: "",
    description: "",
    status: "",
    assignee: undefined,
    dueDate: undefined,
    tags: [],
  };
};

const getTaskValues = (values: FormValidationSchema): TaskValues => {
  const description = get(values, ["description"], "");
  const status = get(values, ["status"], "");
  const assignee = get(values, ["assignee"], "");
  const dueDate = get(values, ["dueDate"], "");
  const tags = get(values, ["tags"], []);

  return {
    listId: get(values, ["list"]),
    name: get(values, ["name"]),
    ...(!description ? {} : { description }),
    ...(!status ? {} : { status }),
    ...(!assignee ? {} : { assignees: [assignee] }),
    ...(!isDate(dueDate) ? {} : { due_date: `${getTime(dueDate as Date)}` }),
    ...(!size(tags) ? {} : { tags }),
  };
};

export {
  getInitValues,
  getTaskValues,
  validationSchema,
};
