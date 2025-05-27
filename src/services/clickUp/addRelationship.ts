import { IDeskproClient } from '@deskpro/app-sdk';
import { baseRequest } from './baseRequest';
import { Task } from './types';
import { RelationshipType } from '../../types';

export function addRelationship(client: IDeskproClient, sourceID: Task['id'], destinationID: Task['id'], type: RelationshipType) {
    if (type === 'link') {
        return baseRequest<void>(client, {
            url: `/task/${sourceID}/link/${destinationID}`,
            method: 'POST'
        });
    };

    if (type === 'waitingOn') {
        return baseRequest<void>(client, {
            url: `/task/${sourceID}/dependency`,
            method: 'POST',
            data: {
                depends_on: destinationID
            }
        });
    };

    if (type === 'blocking') {
        return baseRequest<void>(client, {
            url: `/task/${sourceID}/dependency`,
            method: 'POST',
            data: {
                dependency_of: destinationID
            }
        });
    };
};