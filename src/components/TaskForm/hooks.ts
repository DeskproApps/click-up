import { getFolderlessListsService, getFoldersService, getSpacesService, getTagsService, getWorkspacesService } from "../../services/clickUp";
import { getListFromFolders, getListOptions, getSpaceOptions, getStatusOptions, getTagOptions, getUserOptions, getWorkspaceOptions } from "./utils";
import { QueryKey } from "../../query";
import { useMemo } from "react";
import { useQueryWithClient } from "@deskpro/app-sdk";
import find from "lodash/find";
import size from "lodash/size";
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
    async (client) => {
      const response = await getWorkspacesService(client)

      if (response.success) {
        return response.data.teams
      }

      // Ignore auth errors.
      if (response.errorCode === "auth-error") {
        return []
      }

      // Pass other errors to the error boundary.
      throw response.error

    },
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
    const space = find(spaces.data?.spaces, { id: spaceId });
    const statuses = space?.statuses ?? [];

    return (!spaceId || !size(statuses)) ? [] : statuses;
  }, [spaceId, spaces]);

  const users = useMemo(() => {
    const workspace = find(workspaces.data ?? [], { id: workspaceId });
    const members = workspace?.members ?? [];

    return members.map(member => member.user);

  }, [workspaceId, workspaces]);

  const tags = useQueryWithClient(
    [QueryKey.TAGS, spaceId as Space["id"]],
    (client) => getTagsService(client, spaceId as Space["id"]),
    { enabled: Boolean(spaceId) },
  );

  return {
    isLoading: [workspaces].some(({ isLoading }) => isLoading),
    workspaceOptions: useMemo(() => getWorkspaceOptions(workspaces.data ?? []), [workspaces]),
    spaceOptions: useMemo(() => getSpaceOptions(spaces.data?.spaces), [spaces]),
    listOptions: [
      ...useMemo(() => getListFromFolders(folders.data?.folders), [folders]),
      ...useMemo(() => getListOptions(folderlessLists.data?.lists), [folderlessLists]),
    ],
    statusOptions: getStatusOptions(statuses),
    userOptions: getUserOptions(users),
    tagOptions: getTagOptions(tags.data?.tags),
  };
};

export { useFormDeps };
