import { P5 } from '@deskpro/deskpro-ui';
import { InternalIconLink } from '../common';
import { Task } from '../../services/clickUp/types';
import { Maybe, Relationship, RELATIONSHIP_LABELS } from '../../types';

interface RelationshipItem {
    task: Maybe<Task>;
    relationship: Relationship;
};

export function RelationshipItem({ task, relationship }: RelationshipItem) {
    if (!task) {
        return null;
    };

    const label = RELATIONSHIP_LABELS[relationship.type];
    const target = relationship.isSource ? 'destination' : 'source';

    return (
        <P5 style={{display: 'flex'}}>
            {label}
            {'\u00A0'}
            <strong>{relationship[target].name}</strong>
            <InternalIconLink link={`/view/${relationship[target].id}`} />
        </P5>
    );
};