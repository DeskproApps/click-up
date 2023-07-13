import { createElement } from "react";
import get from "lodash/get";
import map from "lodash/map";
import size from "lodash/size";
import flatten from "lodash/flatten";
import difference from "lodash/difference";
import isDate from "date-fns/isDate";
import getTime from "date-fns/getTime";
import { z } from "zod";
import { nbsp } from "../../constants";
import { parse } from "../../utils/date";
import { getOption } from "../../utils";
import { Member, Tag } from "../common";
import type { Option } from "../../types";
import type { FormValidationSchema, TaskValues } from "./types";
import type {List, Tag as TagType, Task, User, Status, Folder, Workspace} from "../../services/clickUp/types";
import {Space} from "../../services/clickUp/types";

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
    description: description || " ",
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
  add: Array<TagType["name"]>,
  rem: Array<TagType["name"]>,
} => {
  const taskTagIds = map(get(task, ["tags"], []), "name");
  const tagIds = get(values, ["tags"], []);

  return {
    add: difference(tagIds, taskTagIds),
    rem: difference(taskTagIds, tagIds),
  };
};

const getTagOptions = (tags?: TagType[]): Array<Option<TagType["name"]>> => {
  if (!Array.isArray(tags) || !size(tags)) {
    return [];
  }

  return tags.map((tag: TagType) => {
    return getOption(tag.name, createElement(Tag, { tag, key: tag.name }), tag.name);
  });
};

const getUserOptions = (users?: User[]): Array<Option<User["id"]>> => {
  if (!Array.isArray(users) || !size(users)) {
    return [];
  }

  return users.map((user) => {
    const name = get(user, ["username"]) || get(user, ["email"], "");
    const label = createElement(Member, {
      key: get(user, ["id"]),
      name,
      avatarUrl: get(user, ["profilePicture"], ""),
    });
    return getOption(user.id, label, name);
  });
};

const getStatusOptions = (statuses?: Status[]) => {
  if (!Array.isArray(statuses) || !size(statuses)) {
    return [];
  }

  return statuses.map((status: Status) => getOption(status.status, status.status));
};

const getListFromFolders = (folders?: Folder[]): Array<Option<List["id"]>> => {
  if (!Array.isArray(folders) || !size(folders)) {
    return [];
  }

  return flatten(folders.map((folder: Folder) => {
      return [
        { type: "header", label: folder.name },
        ...(get(folder, ["lists"], []) || []).map((list) => {
          return getOption(list.id, `${nbsp}${nbsp}${nbsp}${list.name}`)
        })
      ];
    })) as Array<Option<List["id"]>>;
};

const getListOptions = (lists?: List[]): Array<Option<List["id"]>> => {
  if (!Array.isArray(lists) || !size(lists)) {
    return [];
  }

  return lists.map((list: List) => getOption(list.id, list.name));
};

const getSpaceOptions = (spaces?: Space[]): Array<Option<Space["id"]>> => {
  if (!Array.isArray(spaces) || !size(spaces)) {
    return [];
  }

  return spaces.map((space: Space) => getOption(space.id, space.name));
};

const getWorkspaceOptions = (workspaces?: Workspace[]) => {
  if (!Array.isArray(workspaces) || !size(workspaces)) {
    return [];
  }

  return workspaces.map((workspace: Workspace) => getOption(workspace.id, workspace.name))
};

export {
  getListId,
  getInitValues,
  getTaskValues,
  getTagOptions,
  getUserOptions,
  getListOptions,
  getTagsToUpdate,
  getSpaceOptions,
  getStatusOptions,
  validationSchema,
  getListFromFolders,
  getWorkspaceOptions,
  getAssigneesToUpdate,
};
