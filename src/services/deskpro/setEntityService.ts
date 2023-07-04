import { ENTITY } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { TicketData } from "../../types";

const setEntityService = (
    client: IDeskproClient,
    ticketId: TicketData["ticket"]["id"],
    entityId: string,
) => {
    return client
        .getEntityAssociation(ENTITY, ticketId)
        .set(entityId);
};

export { setEntityService };
