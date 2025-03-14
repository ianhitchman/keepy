export interface CardData {
  id: string;
  position?: number;
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
  listItems?: string[];
  reminderDate?: string;
  isArchived?: boolean;
  isDeleted?: boolean;
  colour?: string;
}

export interface Card {
  id?: string;
  position?: number;
  title?: string;
  content?: string;
  images?: string[];
  tags?: TagsData[];
  listItems?: ListItem[];
  showList?: boolean;
  reminderDate?: string;
  isArchived?: boolean;
  isDeleted?: boolean;
  colour?: string;
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

export interface ListItem {
  id?: string;
  task?: string;
  position?: number;
  label?: string;
  isCompleted?: boolean;
  completed?: Date | null;
  created?: Date;
  updated?: Date;
}


export interface MasonryCardsProps {
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

export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  id?: string;
  body?: any;
  options?: any;
}