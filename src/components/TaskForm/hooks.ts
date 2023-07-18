import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import find from "lodash/find";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getTagsService,
  getSpacesService,
  getFoldersService,
  getWorkspacesService,
  getFolderlessListsService,
} from "../../services/clickUp";
import { QueryKey } from "../../query";
import {
  getTagOptions,
  getUserOptions,
  getListOptions,
  getSpaceOptions,
  getStatusOptions,
  getListFromFolders,
  getWorkspaceOptions,
} from "./utils";
import type { Option } from "../../types";
import type { Workspace, Space, List, Status, User, Tag as TagType } from "../../services/clickUp/types";

type UseFormDeps = (workspaceId?: Workspace["id"], spaceId?: Space["id"]) => {
  isLoading: boolean,
  workspaceOptions: Array<Option<Workspace["id"]>>,
  spaceOptions: Array<Option<Space["id"]>>,
  listOptions: Array<Option<List["id"]>>,
  statusOptions: Array<Option<Status["status"]>>,
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

  const folders = useQueryWithClient(
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
    workspaceOptions: useMemo(() => getWorkspaceOptions(get(workspaces, ["data", "teams"])), [workspaces]),
    spaceOptions: useMemo(() => getSpaceOptions(get(spaces, ["data", "spaces"])), [spaces]),
    listOptions: [
      ...useMemo(() => getListFromFolders(get(folders, ["data", "folders"])), [folders]),
      ...useMemo(() => getListOptions(get(folderlessLists, ["data", "lists"])), [folderlessLists]),
    ],
    statusOptions: getStatusOptions(statuses),
    userOptions: getUserOptions(users),
    tagOptions: getTagOptions(get(tags, ["data", "tags"])),
  };
};

export { useFormDeps };
