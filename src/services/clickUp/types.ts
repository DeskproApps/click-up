import type { Maybe, Timestamp } from "../../types";

export type ClickUpAPIError = {
  ECODE: string, // "INPUT_005"
  err: string, // "Task name invalid"
};

export type AccessToken = {
  token_type: "Bearer",
  access_token: string,
};

export type User = {
  id: number,
  username: string,
  email: string,
  color: string,
  profilePicture: Maybe<string>,
  initials?: string,
  timezone?: string,
  week_start_day?: null
  global_font_support?: boolean,
};

export type Workspace = {
  id: string
  name: string,
  color: string, // "#3498DB"
  avatar: Maybe<string>,
  members: {
    user: Array<User & {
      role: 1,
      custom_role: null,
      last_active: Timestamp,
      date_joined: Timestamp,
      date_invited: Timestamp,
    }>,
  }
};

export type Status = {
  id: string,
  status: string,
  color: string,
  type: "done"|"open"|"closed"|"custom",
  orderindex: number,
};

export type List = {
  id: string,
  name: string,
  orderindex: number,
  content: string,
  status: Maybe<Status>,
  assignee: Maybe<User>,
  task_count: number,
  due_date: Maybe<Timestamp>,
  start_date: Maybe<Timestamp>,
  folder?: Pick<Folder, "id"|"name"|"hidden"> & { access: boolean },
  space: Pick<Space, "id"|"name"> & { access: true },
  archived: boolean,
  override_statuses: boolean,
  permission_level: string, // "create"
};

export type Folder = {
  id: string,
  name: string,
  orderindex: number,
  override_statuses: boolean,
  hidden: boolean,
  space: Pick<Space, "id" | "name">,
  task_count: string,
  archived: boolean,
  statuses: Status[],
  lists: List[],
  permission_level: string, // "create"
};

export type Space = {
  id: string,
  name: string,
  color: string, // "#03A2FD",
  private: boolean,
  admin_can_manage: boolean,
  avatar: null,
  statuses: Status[],
  multiple_assignees: boolean,
  features: object,
  archived: boolean,
};

export type Tag = {
  creator: User["id"],
  name: string,
  tag_bg: string, // "#ff7800"
  tag_fg: string, // "#E50000"
};

export type CheckList = {
  id: string,
  task_id: Task["id"],
  name: string,
  date_created: Timestamp,
  orderindex: number,
  creator: User["id"],
  resolved: 0,
  unresolved: 3,
};

export type Subtask = {
  id: string,
  name: string,
  status: Status,
  url: string,
  orderindex: string,
  date_created: Maybe<Timestamp>,
  date_updated: Maybe<Timestamp>,
  date_closed: Maybe<Timestamp>,
  archived: boolean,
  creator: User,
  assignees: User[],
  watchers: User[],
  checklists: CheckList[],
  tags: Tag[],
  parent: Task["id"],
  due_date: Maybe<Timestamp>,
  start_date: Maybe<Timestamp>,
  points: null,
  time_estimate: null,
  custom_fields: [],
  dependencies: [],
  linked_tasks: [],
};

export type Project = {
  id: string,
  name: string,
  hidden: boolean,
  access: boolean,
};

export type Task = {
  id: string,
  custom_id: Maybe<string>,
  name: string,
  text_content: string, // "Oh this is link page\nsearch tesks\nlinking tasks to the ticket\nlogout\n<p>text</p>",
  description: string, // "Oh this is link page\nsearch tesks\nlinking tasks to the ticket\nlogout\n<p>text</p>",
  status: Status,
  team_id: Workspace["id"],
  url: string,
  subtasks: Subtask[],
  orderindex: string, // "39862594.00002120000000000000000000000000",
  date_created: Maybe<Timestamp>,
  date_updated: Maybe<Timestamp>,
  date_closed: Maybe<Timestamp>,
  date_done: Maybe<Timestamp>,
  due_date: Maybe<Timestamp>,
  start_date: Maybe<Timestamp>,
  archived: boolean,
  creator: User,
  assignees: User[],
  watchers: [],
  checklists: [],
  tags: Tag[],
  parent: null,
  priority: Maybe<number>, // 1 - Urgent, 2 - High, 3 - Normal, 4 - Low
  points: null,
  time_estimate: null,
  custom_fields: [],
  dependencies: [],
  linked_tasks: [],
  sharing: object,
  permission_level: "create",
  list: { // { "id": "900201232319", "name": "MVP", "access": true },
    id: string,
    name: string,
    access: boolean,
  },
  project: Project, // { "id": "90020674555", "name": "Projects", "hidden": false, "access": true }
  folder: Project,  // { "id": "90020674555", "name": "Projects", "hidden": false, "access": true }
  space: { id: string },
};

export type Comment = {
  id: string,
  comment: object,
  comment_text: string,
  user: User,
  reactions: [],
  date: Maybe<Timestamp>,
};


