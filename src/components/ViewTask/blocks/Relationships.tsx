import { useNavigate } from 'react-router-dom';
import { Title } from '@deskpro/app-sdk';
import { LoadingBlock, P5 } from '@deskpro/deskpro-ui';
import { RelationshipItem } from '../../RelationshipItem/RelationshipItem';
import { Container } from '../../common';
import { useTaskRelationships } from '../../../hooks';
import { Task } from '../../../services/clickUp/types';
import { Maybe } from '../../../types';

interface Relationships {
    task: Maybe<Task>;
};

export function Relationships({ task }: Relationships) {
    const navigate = useNavigate();
    const { relationships, isLoading } = useTaskRelationships(task);
    const taskID = task?.id;

    return (
        <Container>
            <Title title={`Relationships (${relationships.length})`} onClick={() => {navigate(`/view/${taskID}/relationships/new`)}} />
            {isLoading ? (
                <LoadingBlock />
            ) : relationships.length === 0 ? (
                <P5>No Relationships Found</P5>
            ) : (
                relationships.map(relationship => (
                    <RelationshipItem key={relationship.id} task={task} relationship={relationship} />
                ))
            )}
        </Container>
    );
};