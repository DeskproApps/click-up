import { useNavigate } from 'react-router-dom';
import { Title, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { P5 } from '@deskpro/deskpro-ui';
import { RelationshipItem } from '../../RelationshipItem/RelationshipItem';
import { Container, ErrorBlock } from '../../common';
import { Maybe, Relationship } from '../../../types';
import { useState } from 'react';
import { useTaskRelationships } from '../../../hooks';
import { Task } from '../../../services/clickUp/types';

interface Relationships {
    task: Maybe<Task>;
};

export function Relationships({ task }: Relationships) {
    const navigate = useNavigate();
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const taskID = task?.id;

    useInitialisedDeskproAppClient(async client => {
        const relationships = await useTaskRelationships(client, task);
        
        setRelationships(relationships);
    }, [task]);

    return (
        <Container>
            <Title title={`Relationships (${relationships.length})`} onClick={() => {navigate(`/view/${taskID}/relationships/new`)}} />
            {relationships.length === 0
                ? <P5>No relationships found</P5>
                : relationships.map(relationship => <RelationshipItem key={relationship.id} task={task} relationship={relationship} />)
            }
        </Container>
    );
};