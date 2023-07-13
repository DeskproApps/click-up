import { useMemo, useState, useCallback } from "react";
import size from "lodash/size";
import { Checkbox, P7, P5, Stack, Spinner } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { NoFound, Container, Card } from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { CheckList, CheckListItem } from "../../../services/clickUp/types";

type Props = {
  checklists: Maybe<CheckList[]>,
  onCompleteChecklist: (
    checklistId: CheckList["id"],
    itemId: CheckListItem["id"],
    resolved: boolean,
  ) => Promise<unknown>,
};

const Item: FC<{
  item: CheckListItem,
  checklistId: CheckList["id"],
  onCompleteChecklist: Props["onCompleteChecklist"],
}> = ({ item, checklistId, onCompleteChecklist }) => {
  const boxSize = 14;
  const [isLoading, setIsLoading] = useState(false);

  const onComplete = useCallback(() => {
    setIsLoading(true);
    onCompleteChecklist(checklistId, item.id, !item.resolved)
      .finally(() => setIsLoading(false));
  }, [onCompleteChecklist, checklistId, item]);

  return (
    <Card style={{ marginBottom: 7 }}>
      <Card.Media>
        {isLoading
          ? (
            <div style={{ width: `${boxSize}px`, height: `${boxSize}px` }}>
              <Spinner size="extra-small"/>
            </div>
          )
          : (
            <Checkbox
              id={item.id}
              size={boxSize}
              checked={item.resolved}
              onChange={onComplete}
            />
          )
        }
      </Card.Media>
      <Card.Body size={boxSize}><P5>{item.name}</P5></Card.Body>
    </Card>
  );
}

const CheckList: FC<{
  checklist: CheckList,
  onCompleteChecklist: Props["onCompleteChecklist"],
}> = ({ checklist, onCompleteChecklist }) => (
  <div style={{ marginBottom: 10, width: "100%" }}>
    <Title as={P7} title={checklist.name} marginBottom={7} />

    {(Array.isArray(checklist.items) ? checklist.items : []).map((item) => (
      <Item
        key={item.id}
        item={item}
        checklistId={checklist.id}
        onCompleteChecklist={onCompleteChecklist}
      />
    ))}
  </div>
);

const Checklists: FC<Props> = ({ checklists, onCompleteChecklist }) => {
  return (
    <Container>
      <Title title="Checklists" />

      <Stack vertical gap={10}>
        {(!Array.isArray(checklists) && !size(checklists))
          ? <NoFound text="No checklists found"/>
          : (checklists as CheckList[]).map((checklist) => (
            <CheckList key={checklist.id} checklist={checklist} onCompleteChecklist={onCompleteChecklist} />
          ))
        }
      </Stack>
    </Container>
  );
};

export { Checklists };
