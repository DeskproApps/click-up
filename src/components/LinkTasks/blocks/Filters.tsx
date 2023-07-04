import { useMemo } from "react";
import { getOption } from "../../../utils";
import { Select, Label } from "../../common";
import type { FC, Dispatch } from "react";
import type { Maybe } from "../../../types";
import type { Workspace } from "../../../services/clickUp/types";

type Props = {
  workspaces: Workspace[],
  selectedWorkspaceId: Maybe<Workspace["id"]>,
  onChangeWorkspace: Dispatch<Workspace["id"]>,
};

const Filters: FC<Props> = ({
  workspaces,
  onChangeWorkspace,
  selectedWorkspaceId,
}) => {
  const workspaceOptions = useMemo(() => {
    return (!Array.isArray(workspaces) ? [] : workspaces)
      .map(({ id, name }) => getOption(id, name));
  }, [workspaces]);

  return (
    <>
      <Label label="Workspace" required>
        <Select
          id="Workspace"
          value={selectedWorkspaceId}
          options={workspaceOptions}
          onChange={(o) => onChangeWorkspace(o.value)}
          noFoundText="No workspace(s) found"
        />
      </Label>
    </>
  );
};

export { Filters };
