import styled from "styled-components";

const CardBase = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const CardMedia = styled.div``;

const CardBody = styled.div`
  width: calc(100% - 12px - 8px);
`;

type CardType = typeof CardBase & {
  Media: typeof CardMedia;
  Body: typeof CardBody;
};

const Card: CardType = Object.assign(CardBase, {
  Media: CardMedia,
  Body: CardBody,
});

export { Card };
