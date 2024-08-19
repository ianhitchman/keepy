export interface CardData {
  id: string;
  position?: number;
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
}

export interface Card {
  id: string;
  position?: number;
  title?: string;
  content?: string;
  images?: string[];
  tags?: TagsData[];
}

export interface TagsData {
  id: string;
  description?: string;
  colour?: string;
}
export interface MasonryCardsProps {
  data: Card[];
}

export interface ColumnDimensions {
  columns: number;
  columnWidthPx: number;
  containerWidth: number;
}

export interface CardTransforms {
  [key: string]: { x: number; y: number; width: number };
}
