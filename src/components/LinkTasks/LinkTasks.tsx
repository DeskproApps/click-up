import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, Search, Navigation } from "../common";
import { Filters, Buttons, Tasks } from "./blocks";
import type { FC, Dispatch } from "react";
import type { Maybe } from "../../types";
import type { Task, Workspace, Space } from "../../services/clickUp/types";

type Props = {
  onChangeSearch: (search: string) => void,
  onCancel: () => void,
  onLinkTasks: () => void,
  isSubmitting: boolean,
  selectedTasks: Task[],
  isLoading: boolean,
  workspaces: Workspace[],
  selectedWorkspaceId: Maybe<Workspace["id"]>,
  onChangeWorkspace: Dispatch<Workspace["id"]>,
  tasks: Task[],
  onChangeSelectedTask: (task: Task) => void,
  onNavigateToCreateTask: () => void,
  spaces: Space[],
};

const LinkTasks: FC<Props> = ({
  onCancel,
  onChangeSearch,
  onLinkTasks,
  isSubmitting,
  selectedTasks,
  workspaces,
  selectedWorkspaceId,
  onChangeWorkspace,
  tasks,
  spaces,
  isLoading,
  onChangeSelectedTask,
  onNavigateToCreateTask,
}) => {
  return (
    <>
      <Container>
        <Navigation selected="one" onTwoNavigate={onNavigateToCreateTask}/>
        <Search onChange={onChangeSearch}/>
        <Filters
          workspaces={workspaces}
          selectedWorkspaceId={selectedWorkspaceId}
          onChangeWorkspace={onChangeWorkspace}
        />
        <Buttons
          onCancel={onCancel}
          onLinkTasks={onLinkTasks}
          isSubmitting={isSubmitting}
          selectedTasks={selectedTasks}
        />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Tasks
          tasks={tasks}
          spaces={spaces}
          isLoading={isLoading}
          workspaces={workspaces}
          selectedTasks={selectedTasks}
          onChangeSelectedTask={onChangeSelectedTask}
        />
      </Container>
    </>
  );
};

export { LinkTasks };
