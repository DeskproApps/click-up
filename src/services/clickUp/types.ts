import type { Maybe, Timestamp } from "../../types";

export type ClickUpAPIError = {
  error: {
    code: number,
    message: string,
  }
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
      date_invited: Timestamp, //"1688105674576"
    }>,
  }
};

export type Status = {
  status: string, // "in progress",
  color: string, // "#04A9F4",
  type: string, //"custom",
  orderindex: number, // 1,
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

export type Task = {
  id: string,
  custom_id: Maybe<string>,
  name: string,
  text_content: string, // "Oh this is link page\nsearch tesks\nlinking tasks to the ticket\nlogout\n<p>text</p>",
  description: string, // "Oh this is link page\nsearch tesks\nlinking tasks to the ticket\nlogout\n<p>text</p>",
  status: Status,
  team_id: Workspace["id"],
  url: string,
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
  project: { // { "id": "90020674555", "name": "Projects", "hidden": false, "access": true }
    id: string,
    name: string,
    hidden: boolean,
    access: boolean,
  },
  folder: { // { "id": "90020674555", "name": "Projects", "hidden": false, "access": true }
    id: string,
    name: string,
    hidden: boolean,
    access: boolean,
  },
  space: { id: string },
};
