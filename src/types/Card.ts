export interface CardData {
  id: string;
  position?: number;
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
  reminderDate?: string;
  isArchived?: boolean;
  isDeleted?: boolean;
}

export interface Card {
  id: string;
  position?: number;
  title?: string;
  content?: string;
  images?: string[];
  tags?: TagsData[];
  reminderDate?: string;
  isArchived?: boolean;
  isDeleted?: boolean;
}

export interface ConfigData {
  id: string | null;
  taskPositions: Record<string, number>;
  created: string | null;
  updated: string | null;
}

export interface TagsData {
  id: string;
  description?: string;
  colour?: string;
}
export interface MasonryCardsProps {
  data: Card[];
  onSave?: (type: string, data: Record<string, any>) => void;
}

export interface ColumnDimensions {
  columns: number;
  columnWidthPx: number;
  containerWidth: number;
}

export interface CardTransforms {
  [key: string]: { x: number; y: number; width: number };
}
