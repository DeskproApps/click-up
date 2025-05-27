import { IDeskproClient } from '@deskpro/app-sdk';
import { getTaskService } from '../services/clickUp';
import { Task } from '../services/clickUp/types';
import { Maybe, Relationship } from '../types';

export async function useTaskRelationships(client: IDeskproClient, task: Maybe<Task>): Promise<Relationship[]> {
    if (!task) {
        return [];
    };

    const relatedTasks = task.linked_tasks;

    const relationships = await Promise.all(relatedTasks.map(async relatedTask => {
        const isSource = relatedTask.task_id === task.id;
        const sourceTask = await getTaskService(client, relatedTask.task_id);
        const destinationTask = await getTaskService(client, relatedTask.link_id);

        return {
            id: relatedTask.date_created,
            type: 'link' as const,
            source: {
                id: relatedTask.task_id,
                name: sourceTask.name
            },
            destination: {
                id: relatedTask.link_id,
                name: destinationTask.name
            },
            isSource
        };
    }));

    return relationships;
};