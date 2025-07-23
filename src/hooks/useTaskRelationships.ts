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
            const sourceTask = await (async () => {
                const data = await getTaskService(client, relatedTask.task_id);

                if (data.success) {
                    return data.data;
                }

                return null;
            })()
            const destinationTask = await (async () => {
                const data = await getTaskService(client, relatedTask.link_id);

                if (data.success) {
                    return data.data;
                }

                return null;
            })()


            return {
                id: relatedTask.date_created,
                type: 'link' as RelationshipType,
                source: {
                    id: relatedTask.task_id,
                    name: sourceTask?.name ?? ""
                },
                destination: {
                    id: relatedTask.link_id,
                    name: destinationTask?.name ?? ""
                },
                isSource
            };
        })
    );

    const dependencyRelationships = await Promise.all(
        dependencies.map(async dependency => {
            const isSource = dependency.task_id === task.id;
            const waitingTask = await (async () => {
                const data = await getTaskService(client, dependency.task_id);

                if (data.success) {
                    return data.data;
                }

                return null;
            })() 
            
            const blockingTask = await (async () => {
                const data = await getTaskService(client, dependency.depends_on);

                if (data.success) {
                    return data.data;
                }

                return null;
            })()

            const type: RelationshipType = isSource ? 'waitingOn' : 'blocking';

            return {
                id: dependency.date_created,
                type,
                source: {
                    id: dependency.task_id,
                    name: waitingTask?.name ?? ""
                },
                destination: {
                    id: dependency.depends_on,
                    name: blockingTask?.name ?? ""
                },
                isSource
            };
        })
    );

    return [...linkRelationships, ...dependencyRelationships];
}

export const useTaskRelationships = (task: Maybe<Task>) => {
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useInitialisedDeskproAppClient(async client => {
        if (!task?.id) {
            setRelationships([]);
            setIsLoading(false);

            return;
        };

        setIsLoading(true);

        const relationships = await getTaskRelationships(client, task);

        setRelationships(relationships);
        setIsLoading(false);
    }, [task?.id]);

    return { relationships, isLoading };
};