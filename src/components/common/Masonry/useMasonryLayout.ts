import { useEffect, useState, useRef } from "react";
import {
  getColumnsDimensions,
  getTallestColumn,
  sortElementsByHeight,
  getPositionRelativeToDocument,
  getColumnHeightAtRow,
  moveDataElement,
  getDataAsRows
} from "./MasonryCards.util";
import { Card, ColumnDimensions, CardTransforms } from "../../../types/Card";

const useMasonryLayout = (
  data: Card[],
  container: React.RefObject<HTMLDivElement>,
  navIsOpen: boolean,
  navIsHoverOpen: boolean
) => {
  const [columnsDimensions, setColumnsDimensions] =
    useState<ColumnDimensions | null>(null);
  const [dataAsRows, setDataAsRows] = useState<Card[][] | null>(null);
  const [cardTransforms, setCardTransforms] = useState<CardTransforms>({});
  const [containerHeight, setContainerHeight] = useState(0);

  const topLeftCoordinates = useRef({ x: 0, y: 0 });

  const resizeColumns = () => {
    const dimensions = getColumnsDimensions(container.current);
    setColumnsDimensions(dimensions);
  };

  const positionFirstRow = (row: Card[]) => {
    if (!container.current || !columnsDimensions || !row) return;
    row.forEach((card: Card, columnNumber: number) => {
      transformTopRowCard(card, columnNumber);
    });
  };

  const positionSubsequentRow = (row: Card[], rowNumber: number) => {
    if (!container.current || !columnsDimensions || !row) return;

    const previousRow = [...(dataAsRows?.[rowNumber - 1] || [])];
    let previousRowElements = previousRow.map((card: Card) => {
      return (
        container.current?.querySelector(`[data-id="${card?.id}"]`) || null
      );
    }) || [];

    previousRowElements = sortElementsByHeight(previousRowElements);

    row.forEach((card: Card, columnNumber: number) => {
      const cardElement =
        container.current?.querySelector(`div[data-id="${card?.id}"]`) || null;
      if (!cardElement) return;

      const cardAbove = previousRowElements[columnNumber];
      const cardAboveColumn = parseInt(
        cardAbove?.getAttribute("data-column") || columnNumber.toString()
      );
      const cardCoordinates = getPositionRelativeToDocument(cardElement);
      const calcCardY = getColumnHeightAtRow(
        rowNumber,
        cardAboveColumn,
        previousRowElements
      );
      const x = parseInt(cardAbove?.getAttribute("data-x") || "0");
      cardElement.setAttribute("data-x", x.toString());
      cardElement.setAttribute("data-column", cardAboveColumn.toString());
      const y = Math.floor(
        0 - cardCoordinates.y + calcCardY + topLeftCoordinates.current.y
      );
      cardTransforms[card?.id] = {
        x,
        y,
        width: columnsDimensions?.columnWidthPx || 0,
      };
    });
    setCardTransforms({ ...cardTransforms });
  };

  const transformTopRowCard = (card: Card, columnNumber: number) => {
    const cardElement = document.querySelector(`[data-id="${card?.id}"]`);
    if (!cardElement) return;
    const cardCoordinates = getPositionRelativeToDocument(cardElement);
    if (columnNumber === 0) {
      topLeftCoordinates.current.x = cardCoordinates.x;
      topLeftCoordinates.current.y = cardCoordinates.y;
      cardTransforms[card?.id] = {
        x: 0,
        y: 0,
        width: columnsDimensions?.columnWidthPx || 0,
      };
      cardElement.setAttribute("data-x", "0");
      cardElement.setAttribute("data-column", "0");
    } else {
      const x = Math.floor(
        (columnsDimensions?.columnWidthPx || 0) * columnNumber
      );
      cardElement.setAttribute("data-x", x.toString());
      cardElement.setAttribute("data-column", columnNumber.toString());
      const y = Math.floor(0 - cardCoordinates.y + topLeftCoordinates.current.y);
      cardTransforms[card?.id] = {
        x,
        y,
        width: columnsDimensions?.columnWidthPx || 0,
      };
    }
    setCardTransforms({ ...cardTransforms });
  };

  const processRows = () => {
    if (!container.current || !dataAsRows || !columnsDimensions) return;
    dataAsRows.forEach((row, rowNumber) => {
      if (rowNumber === 0) {
        positionFirstRow(row);
      } else {
        positionSubsequentRow(row, rowNumber);
      }
    });
    setTimeout(() => {
      setContainerHeight(getTallestColumn(container.current, dataAsRows));
      if (container.current) container.current.style.opacity = "1";
    }, 500);
  };

  const init = (moveSourceId?: string, moveTargetId?: string) => {
    setCardTransforms({});
    setDataAsRows(null);
    if (container.current) {
      const dimensions = getColumnsDimensions(container.current);
      const mutatedData = moveDataElement(
        data || null,
        moveSourceId,
        moveTargetId
      );
      const rows = getDataAsRows(mutatedData || null, dimensions.columns);
      setDataAsRows(rows);
      processRows();
      if (container.current) {
        const cards = container.current.querySelectorAll(
          ".masonry-container__card"
        );
        cards.forEach((card) => {
          (card as HTMLElement).classList.add(
            "masonry-container__card--easing"
          );
        });
      }
    }
  };

  useEffect(resizeColumns, [container, data]);
  useEffect(() => {
    setTimeout(resizeColumns, 300);
  }, [navIsOpen, navIsHoverOpen]);
  useEffect(init, [columnsDimensions]);

  return {
    cardTransforms,
    containerHeight,
    init,
  };
};

export default useMasonryLayout;
