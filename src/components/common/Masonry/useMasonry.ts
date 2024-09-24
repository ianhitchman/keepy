import { useState, useEffect } from "react";

interface MasonryCardItem {
  id: string;
  [key: string]: any;  // can have any other key/value pairs
}

interface MasonryCardOptions {
  columnWidth?: number;
  gap?: number;
  columns?: number;
}

interface MasonryCardsProps {
  container: React.RefObject<HTMLDivElement>;
  data: MasonryCardItem[];
  options?: MasonryCardOptions
}

interface ItemHeights {
  [id: string]: number;  // id is a string, and the value is the corresponding height (number)
}

const getItemHeights = (container: HTMLDivElement | null, data: MasonryCardItem[]) => {
  if (!container || !data) return {};
  const itemHeights: ItemHeights = {};
  data.forEach((item: MasonryCardItem) => {
    const card = container.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
    if (card?.style) {
      card.style.position = 'absolute';
    }
    const cardRect = card?.getBoundingClientRect();
    itemHeights[item.id] = cardRect?.height || 0;
  });
  return itemHeights;
}

const useMasonry = ({ data: dataInit, container, options }: MasonryCardsProps) => {

  const [data, setData] = useState<MasonryCardItem[]>(dataInit);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [itemHeights, setItemHeights] = useState<ItemHeights>({});

  const columns = options?.columns;
  let columnWidth = options?.columnWidth || 256;
  const columnGap = options?.gap || 0;

  // get parent dimensions
  const parent = container.current?.parentNode as Element;
  // get left and right padding for parent
  const style = parent && window.getComputedStyle(parent);
  const paddingLeft = parseFloat(style?.paddingLeft || "0");
  const paddingRight = parseFloat(style?.paddingRight || "0");
  const parentWidthMinusPadding = parentWidth - paddingLeft - paddingRight;

  if (parentWidthMinusPadding && (parentWidthMinusPadding < (2 * columnWidth) + columnGap)) {
    columnWidth = parentWidthMinusPadding;
  }

  useEffect(() => {
    setData(dataInit);
  }, [dataInit]);

  useEffect(() => {
    if (!container.current) return;
    container.current.style.opacity = "1";
    container.current.style.position = "relative";

    // Create a ResizeObserver to monitor the container's width
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect) {
        setParentWidth(entries[0].contentRect.width)
      }
    });
    // Observe the container's parent's resizing
    resizeObserver.observe(container.current?.parentNode as Element);

    const childResizeObserver = new ResizeObserver(() => {
      const newHeights = getItemHeights(container.current, data);
      setItemHeights(newHeights);
    });
    // Observe all child elements within the container for height changes
    const childNodes = container.current.children;
    for (let i = 0; i < childNodes.length; i++) {
      childResizeObserver.observe(childNodes[i]);
    }

    // Clean up on unmount
    return () => {
      resizeObserver.disconnect();
      childResizeObserver.disconnect();
    };

  }, [container, data]);

  const columnCount = columns || Math.max(1, Math.floor((parentWidthMinusPadding + columnGap) / (columnWidth + columnGap)));
  const containerWidth = columnWidth * columnCount + columnGap * (columnCount - 1);

  let row = 1;
  let column = 1;
  let previousRowCards: any[] = [];
  let currentRowCards: any[] = [];
  let containerHeight = 0;
  const columnHeights: Record<number, number> = {};

  const cards = data.map((cardData, index) => {
    const cardHeight = itemHeights[cardData.id] || 0;
    let x, y;

    if (index < columnCount) {
      // First row
      x = (column - 1) * (columnWidth + columnGap);
      y = 0;
      columnHeights[x] = cardHeight;
    }
    else {
      // Find the shortest column to place card underneath
      const shortestCard = previousRowCards.reduce((prev, current) => {
        return prev.height < current.height ? prev : current;
      });
      x = shortestCard.x;
      y = shortestCard.y + shortestCard.height + columnGap;
      columnHeights[x] = y + cardHeight;
      // remove the shortest card from previous row
      previousRowCards = previousRowCards.filter((card: any) => card.id !== shortestCard.id);

    }
    const card = {
      id: cardData.id,
      width: columnWidth,
      height: Math.floor(cardHeight),
      row,
      column,
      x,
      y,
    }
    row = card.column === columnCount ? row + 1 : row;
    column = card.column === columnCount ? 1 : column + 1;
    currentRowCards.push(card);
    if (card.column === columnCount) {
      previousRowCards = [...currentRowCards];
      currentRowCards = [];
    }
    return card;
  });

  // get largest column height
  containerHeight = Math.max(...Object.values(columnHeights));

  return {
    parentWidth,
    containerWidth,
    columnWidth,
    columnCount,
    columnGap,
    containerHeight,
    cards
  };
};

export default useMasonry;
