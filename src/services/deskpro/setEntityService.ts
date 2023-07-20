import { ENTITY } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { TicketData, EntityMetadata } from "../../types";

const setEntityService = (
    client: IDeskproClient,
    ticketId: TicketData["ticket"]["id"],
    entityId: string,
    metaData?: EntityMetadata,
) => {
    return client
        .getEntityAssociation(ENTITY, ticketId)
        .set(entityId, metaData);
};

export { setEntityService };
