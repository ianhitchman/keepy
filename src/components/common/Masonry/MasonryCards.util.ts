import { Card } from "../../../types/Card";

export const getCardTransforms = (id: string, cardsData: any[], defaultWidth?: number) => {
  const card = cardsData.find((card) => card.id === id);
  let x, y: number;
  let width: number | string;
  if (card) {
    x = card.x;
    y = card.y;
    width = card.width;
  } else {
    x = 0;
    y = 0;
    width = defaultWidth || "auto";
  }
  return { x, y, width };
};

export const moveDataElement = (
  data: Card[],
  sourceId?: string,
  targetId?: string
) => {
  if (!sourceId || !targetId) return data;
  let sourceIndex = data.findIndex((card: Card) => card?.id === sourceId);
  let targetIndex = data.findIndex((card: Card) => card?.id === targetId);
  const returnData: Card[] = [];
  data?.forEach((card: Card, index: number) => {
    if (index === sourceIndex) return;
    if (index === targetIndex) {
      if (sourceIndex < targetIndex) {
        returnData.push(card);
        returnData.push(data[sourceIndex]);
      } else {
        returnData.push(data[sourceIndex]);
        returnData.push(card);
      }
      return;
    }
    returnData.push(card);
  });
  return returnData;
};