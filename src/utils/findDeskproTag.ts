import find from "lodash/find";
import toLower from "lodash/toLower";
import { DESKPRO_TAG } from "../constants";
import type { Tag } from "../services/clickUp/types";

const findDeskproTag = (tags: Tag[]): Tag|void => {
  if (!Array.isArray(tags)) {
    return;
  }

  return find(tags, ({ name }) => toLower(name) === toLower(DESKPRO_TAG.name));
};

export { findDeskproTag };
