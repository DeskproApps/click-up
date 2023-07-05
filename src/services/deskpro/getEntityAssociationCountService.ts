import { ENTITY } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";

const getEntityAssociationCountService = (client: IDeskproClient, entityId: string) => {
  return client.entityAssociationCountEntities(ENTITY, entityId);
};

export { getEntityAssociationCountService };
