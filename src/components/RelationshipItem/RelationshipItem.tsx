import { P5 } from '@deskpro/deskpro-ui';
import { InternalIconLink } from '../common';
import { Task } from '../../services/clickUp/types';
import { Maybe, Relationship } from '../../types';

interface RelationshipItem {
    task: Maybe<Task>;
    relationship: Relationship;
};

export function RelationshipItem({ task, relationship }: RelationshipItem) {
    if (!task) {
        return null;
    };

    let beginningText = '';

    switch (relationship.type) {
        case 'link':
            beginningText = 'Linked to';

            break;
    };

    const target = relationship.isSource ? 'destination' : 'source';

    return (
        <P5 style={{display: 'flex'}}>
            {beginningText}
            {'\u00A0'}
            <strong>{relationship[target].name}</strong>
            <InternalIconLink link={`/view/${relationship[target].id}`} />
        </P5>
    );
};