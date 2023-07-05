import { IDeskproClient } from "@deskpro/app-sdk";
import { ENTITY } from "../../constants";

const deleteEntityService = (
    client: IDeskproClient,
    ticketId: string,
    entityId: string,
) => {
    return client
        .getEntityAssociation(ENTITY, ticketId)
        .delete(entityId);
};

export { deleteEntityService };
