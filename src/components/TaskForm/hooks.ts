import { useMemo, createElement } from "react";
import get from "lodash/get";
import size from "lodash/size";
import find from "lodash/find";
import flatten from "lodash/flatten";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getTagsService,
  getSpacesService,
  getFoldersService,
  getWorkspacesService,
  getFolderlessListsService,
} from "../../services/clickUp";
import { QueryKey } from "../../query";
import { getOption } from "../../utils";
import { nbsp } from "../../constants";
import { Member, Tag } from "../common";
import type { Option } from "../../types";
import type { Workspace, Space, List, Status, Folder, User, Tag as TagType } from "../../services/clickUp/types";

type UseFormDeps = (workspaceId?: Workspace["id"], spaceId?: Space["id"]) => {
  isLoading: boolean,
  workspaceOptions: Array<Option<Workspace["id"]>>,
  spaceOptions: Array<Option<Space["id"]>>,
  listOptions: Array<Option<List["id"]>>,
  statusOptions: Array<Option<Status["id"]>>,
  userOptions: Array<Option<User["id"]>>,
  tagOptions: Array<Option<TagType["name"]>>,
};

const useFormDeps: UseFormDeps = (workspaceId, spaceId) => {
  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    (client) => getWorkspacesService(client),
  );

  const spaces = useQueryWithClient(
    [QueryKey.SPACES, workspaceId as Workspace["id"]],
    (client) => getSpacesService(client, workspaceId as Workspace["id"]),
    { enabled: Boolean(workspaceId) },
  );

  const lists = useQueryWithClient(
    [QueryKey.FOLDERS, spaceId as Space["id"]],
    (client) => getFoldersService(client, spaceId as Space["id"]),
    { enabled: Boolean(spaceId) },
  );

  const folderlessLists = useQueryWithClient(
    [QueryKey.FOLDERLESS_LISTS, spaceId as Space["id"]],
    (client) => getFolderlessListsService(client, spaceId as Space["id"]),
    { enabled: Boolean(spaceId) },
  );

  const statuses = useMemo(() => {
    const space = find(get(spaces, ["data", "spaces"]), { id: spaceId });
    const statuses = get(space, ["statuses"], []);

    return (!spaceId || !size(statuses)) ? [] : statuses;
  }, [spaceId, spaces]);

  const users = useMemo(() => {
    const workspace = find(get(workspaces, ["data", "teams"]), { id: workspaceId });
    const members = get(workspace, ["members"], []);

    return (!workspaceId || !size(members)) ? [] : members.map(({ user }: Workspace["members"]) => user);
  }, [workspaceId, workspaces]);

   const tags = useQueryWithClient(
     [QueryKey.TAGS, spaceId as Space["id"]],
     (client) => getTagsService(client, spaceId as Space["id"]),
     { enabled: Boolean(spaceId) },
   );

  return {
    isLoading: [workspaces].some(({ isLoading }) => isLoading),
    workspaceOptions: useMemo(() => {
      return (get(workspaces, ["data", "teams"], []) || []).map((workspace: Workspace) => getOption(workspace.id, workspace.name))
    }, [workspaces]) as Array<Option<Workspace["id"]>>,
    spaceOptions: useMemo(() => {
      return (get(spaces, ["data", "spaces"], []) || []).map((space: Space) => getOption(space.id, space.name))
    }, [spaces]) as Array<Option<Space["id"]>>,
    listOptions: [
      ...useMemo(() => {
        return flatten((get(lists, ["data", "folders"], []) || []).map((folder: Folder) => {
          return [
            { type: "header", label: folder.name },
            ...(get(folder, ["lists"], []) || []).map((list) => {
              return getOption(list.id, `${nbsp}${nbsp}${nbsp}${list.name}`)
            })
          ];
        }));
      }, [lists]) as Array<Option<List["id"]>>,
      ...useMemo(() => {
        return (get(folderlessLists, ["data", "lists"], []) || []).map((list: List) => getOption(list.id, list.name));
      }, [folderlessLists]) as Array<Option<List["id"]>>,
    ],
    statusOptions: statuses.map((status: Status) => getOption(status.id, status.status)),
    userOptions: users.map((user: User) => {
      const label = createElement(Member, {
        name: get(user, ["username"], ""),
        avatarUrl: get(user, ["profilePicture"], ""),
      });
      return getOption(user.id, label, get(user, ["username"], ""));
    }) as Array<Option<User["id"]>>,
    tagOptions: (get(tags, ["data", "tags"], []) || []).map((tag: TagType) => {
      return getOption(tag.name, createElement(Tag, { tag }), tag.name);
    }),
  };
};

export { useFormDeps };
