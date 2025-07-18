import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HorizontalDivider, Search, Select, useDeskproAppClient, useDeskproElements } from '@deskpro/app-sdk';
import { Stack } from '@deskpro/deskpro-ui';
import { Button, Container, ErrorBlock, Label } from '../../components/common';
import { useSetTitle } from '../../hooks';
import { Task, Workspace } from '../../services/clickUp/types';
import { RELATIONSHIP_OPTIONS, RelationshipType } from '../../types';
import { useTasks } from '../LinkPage/hooks';
import { Tasks } from '../../components/LinkTasks/blocks';
import { getFilteredTasks, getOption } from '../../utils';
import { addRelationship } from '../../services/clickUp/addRelationship';

export function AddRelationshipPage() {
    const { client } = useDeskproAppClient();
    const [query, setQuery] = useState('');
    const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
    const [selectedType, setSelectedType] = useState<RelationshipType>('link');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [error, setError] = useState<string | null>(null);

    const [selectedWorkspaceID, setSelectedWorkspaceID] = useState<Workspace['id'] | null>(null);
    const { isLoading, spaces, tasks, workspaces } = useTasks(selectedWorkspaceID);

    useSetTitle('Add Relationship');

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement('refresh', {type: 'refresh_button'});
        registerElement('home', {
            type: 'home_button',
            payload: {
                type: 'changePage',
                path: '/home'
            }
        });
    });

    useEffect(() => {
        setSelectedWorkspaceID(workspaces && workspaces.length > 0 ? workspaces[0].id : null);
    }, [workspaces]);

    const handleQueryChange = (query: string) => {
        setQuery(query);
    };

    const options = RELATIONSHIP_OPTIONS.map(type => getOption<RelationshipType>(type.value, type.label));

    const handleSelectChange = (value?: string | string[]) => {
        setSelectedType(value as RelationshipType);
    };

    const handleLinkTasks = () => {
        if (!client || !taskId) {
            return;
        };

        setIsSubmitting(true);

        const promises = selectedTasks.map(task => addRelationship(client, taskId, task.id, selectedType));

        Promise.all(promises)
            .then(() => {
                navigate(`/view/${taskId}`);
            })
            .catch(error => {
                setError(error instanceof Error ? error.message : 'error linking tasks');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleCancel = () => {
        navigate(`/view/${taskId}`);
    };

    const handleChangeSelectedTask = (task: Task) => {
        let newSelectedTasks = [...selectedTasks];

        if (selectedTasks.some(selectedTask => task.id === selectedTask.id)) {
            newSelectedTasks = selectedTasks.filter(selectedCard => selectedCard.id !== task.id);
        } else {
            newSelectedTasks.push(task);
        };

        setSelectedTasks(newSelectedTasks);
    };

    const filteredTasks = getFilteredTasks(tasks, { query }).filter(task => task.id !== taskId);

    return (
        <>
            <Container>
                {error && <ErrorBlock text={error} />}
                <Search onChange={handleQueryChange}/>
                <Label htmlFor='relationship-type' label='Relationship Type' required>
                    <Select<RelationshipType>
                        id='relationship-type'
                        options={options}
                        value={selectedType}
                        placeholder='select relationship type'
                        onChange={handleSelectChange}
                    />
                </Label>
                <Stack justify='space-between'>
                    <Button
                        type='button'
                        text='Link Tasks'
                        loading={isSubmitting}
                        disabled={selectedTasks.length === 0}
                        onClick={handleLinkTasks}
                    />
                    <Button
                        type='button'
                        text='Cancel'
                        intent='secondary'
                        onClick={handleCancel}
                    />
                </Stack>
            </Container>
            <HorizontalDivider />
            <Container>
                <Tasks
                    tasks={filteredTasks}
                    spaces={spaces}
                    workspaces={workspaces}
                    isLoading={isLoading}
                    selectedTasks={selectedTasks}
                    onChangeSelectedTask={handleChangeSelectedTask}
                />
            </Container>
        </>
    );
};