import get from "lodash/get";
import toLower from "lodash/toLower";
import type { Task } from "../services/clickUp/types";

type Options = {
    query?: string,
};

const getFilteredTasks = (tasks: Task[], options: Options) => {
    const query = get(options, ["query"]);

    if (!query) {
        return tasks;
    }

    let filteredTasks: Task[] = [];

    if (query) {
        filteredTasks = tasks.filter(({ id, name }) => {
            const taskTitle = toLower(name);
            const search = toLower(query);

            return taskTitle.includes(search) || id.includes(search);
        })
    }

    return filteredTasks;
};

export { getFilteredTasks };
