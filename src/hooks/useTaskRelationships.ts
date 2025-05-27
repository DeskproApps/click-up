import { useState } from 'react';
import { IDeskproClient, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { getTaskService } from '../services/clickUp';
import { Task } from '../services/clickUp/types';
import { Maybe, Relationship, RelationshipType } from '../types';

async function getTaskRelationships(client: IDeskproClient, task: Task): Promise<Relationship[]> {
    if (!task) return [];

    const linkedTasks = task.linked_tasks ?? [];
    const dependencies = task.dependencies ?? [];

    const linkRelationships = await Promise.all(
        linkedTasks.map(async relatedTask => {
            const isSource = relatedTask.task_id === task.id;
            const sourceTask = await getTaskService(client, relatedTask.task_id);
            const destinationTask = await getTaskService(client, relatedTask.link_id);

            return {
                id: relatedTask.date_created,
                type: 'link' as RelationshipType,
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
        })
    );

    const dependencyRelationships = await Promise.all(
        dependencies.map(async dependency => {
            const isSource = dependency.task_id === task.id;
            const waitingTask = await getTaskService(client, dependency.task_id);
            const blockingTask = await getTaskService(client, dependency.depends_on);

            return {
                id: dependency.date_created,
                type: (isSource ? 'waitingOn' : 'blocking') as RelationshipType,
                source: {
                    id: dependency.task_id,
                    name: waitingTask.name
                },
                destination: {
                    id: dependency.depends_on,
                    name: blockingTask.name
                },
                isSource
            };
        })
    );

    return [...linkRelationships, ...dependencyRelationships];
}

export const useTaskRelationships = (task: Maybe<Task>) => {
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useInitialisedDeskproAppClient(async client => {
        if (!task) {
            return;
        };

        setIsLoading(true);

        const relationships = await getTaskRelationships(client, task);

        setRelationships(relationships);
        setIsLoading(false);
    }, [task]);

    return { relationships, isLoading };
};