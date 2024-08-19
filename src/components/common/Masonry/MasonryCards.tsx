import { useRef, useEffect, useState } from "react";
import MasonryCard from "./MasonryCard";
import util from "./MasonryCards.util";
import useStore from "../../../hooks/useStore";
import useThrottledResize from "../../../hooks/useThrottledResize";
import {
  Card,
  ColumnDimensions,
  CardTransforms,
  MasonryCardsProps,
} from "../../../types/Card";
import "./MasonryCards.scss";

const MasonryCards: React.FC<MasonryCardsProps> = ({ data }) => {
  const navIsOpen = useStore((state) => state.navIsOpen);
  const navIsHoverOpen = useStore((state) => state.navIsHoverOpen);
  const container = useRef<HTMLDivElement | null>(null);
  const [columnsDimensions, setColumnsDimensions] =
    useState<ColumnDimensions | null>(null);
  const [dataAsRows, setDataAsRows] = useState<Card[][] | null>(null);
  const dataAsRowsFlattened = JSON.stringify(dataAsRows);
  const topLeftCoordinates = { x: 0, y: 0 };
  const [cardTransforms, setCardTransforms] = useState<CardTransforms>({});
  const [containerHeight, setContainerHeight] = useState(0);

  const rowsAsElements =
    dataAsRows?.map((row) => {
      return row.map((card) => {
        return (
          container.current?.querySelector(`[data-id="${card.id}"]`) || null
        );
      });
    }) || [];

  const resizeColumns = () => {
    const dimensions = util.getColumnsDimensions(container.current);
    setColumnsDimensions(dimensions);
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
      setContainerHeight(util.getTallestColumn(container.current, dataAsRows));
      if (container.current) container.current.style.opacity = "1";
    }, 500);
  };

  const positionFirstRow = (row: Card[]) => {
    if (!container.current || !dataAsRows || !columnsDimensions || !row) return;
    row.forEach((card: Card, columnNumber: number) => {
      transformTopRowCard(card, columnNumber);
    });
  };

  const positionSubsequentRow = (row: Card[], rowNumber: number) => {
    if (!container.current || !dataAsRows || !columnsDimensions || !row) return;

    // sort previous row by height, and position this row accordingly
    const previousRow = [...dataAsRows[rowNumber - 1]];
    let previousRowElements =
      previousRow.map((card: Card) => {
        return (
          container.current?.querySelector(`[data-id="${card.id}"]`) || null
        );
      }) || [];
    previousRowElements = util.sortElementsByHeight(previousRowElements);

    row.forEach((card: Card, columnNumber: number) => {
      const cardElement =
        container.current?.querySelector(`div[data-id="${card.id}"]`) || null;
      if (!cardElement) return;
      const cardAbove = previousRowElements[columnNumber];
      const cardAboveColumn = parseInt(
        cardAbove?.getAttribute("data-column") || columnNumber.toString()
      );
      const cardCoordinates = util.getPositionRelativeToDocument(cardElement);
      const calcCardY = util.getColumnHeightAtRow(
        rowNumber,
        cardAboveColumn,
        rowsAsElements
      );
      const x = parseInt(cardAbove?.getAttribute("data-x") || "0");
      cardElement.setAttribute("data-x", x.toString());
      cardElement.setAttribute("data-column", cardAboveColumn.toString());
      const y = Math.floor(
        0 - cardCoordinates.y + calcCardY + topLeftCoordinates.y
      );
      cardTransforms[card.id] = {
        x,
        y,
        width: columnsDimensions?.columnWidthPx || 0,
      };
    });
    setCardTransforms({ ...cardTransforms });
  };

  const transformTopRowCard = (card: Card, columnNumber: number) => {
    const cardElement = document.querySelector(`[data-id="${card.id}"]`);
    if (!cardElement) return;
    const cardCoordinates = util.getPositionRelativeToDocument(cardElement);
    if (columnNumber === 0) {
      // if first card, store top left co-ordinates
      topLeftCoordinates.x = cardCoordinates.x;
      topLeftCoordinates.y = cardCoordinates.y;
      cardTransforms[card.id] = {
        x: 0,
        y: 0,
        width: columnsDimensions?.columnWidthPx || 0,
      };
      cardElement.setAttribute("data-x", "0");
      cardElement.setAttribute("data-column", "0");
    } else {
      // if not first card, position relative to top left
      const x = Math.floor(
        (columnsDimensions?.columnWidthPx || 0) * columnNumber
      );
      cardElement.setAttribute("data-x", x.toString());
      cardElement.setAttribute("data-column", columnNumber.toString());
      const y = Math.floor(0 - cardCoordinates.y + topLeftCoordinates.y);
      cardTransforms[card.id] = {
        x,
        y,
        width: columnsDimensions?.columnWidthPx || 0,
      };
    }
    setCardTransforms({ ...cardTransforms });
  };

  const init = () => {
    setCardTransforms({});
    // setColumnsDimensions(null);
    setDataAsRows(null);
    if (container.current) {
      const dimensions = util.getColumnsDimensions(container.current);
      const rows = util.getDataAsRows(data, dimensions.columns);
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

  useEffect(resizeColumns, [container, data, dataAsRowsFlattened]);
  useEffect(() => {
    setTimeout(resizeColumns, 300);
  }, [navIsOpen, navIsHoverOpen]);
  useEffect(init, [columnsDimensions]);
  useThrottledResize(init, 500);
  const containerStyles = {
    width: columnsDimensions
      ? columnsDimensions?.containerWidth + "px"
      : "auto",
    height: containerHeight ? containerHeight + "px" : "auto",
  };

  return (
    <div ref={container} className="masonry-container" style={containerStyles}>
      {data?.map((card: Card) => (
        <MasonryCard
          key={card.id}
          data={card}
          cardTransforms={cardTransforms}
        />
      ))}
    </div>
  );
};

export default MasonryCards;
