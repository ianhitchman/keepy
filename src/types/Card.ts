export interface CardData {
  id: string;
  position: number;
  title: string;
  content: string;
}

export interface MasonryCardsProps {
  data: CardData[];
}

export interface ColumnDimensions {
  columns: number;
  columnWidthPx: number;
  containerWidth: number;
}

export interface CardTransforms {
  [key: string]: { x: number; y: number; width: number };
}
