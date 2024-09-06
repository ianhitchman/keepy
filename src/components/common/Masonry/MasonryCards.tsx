import { useRef, useEffect, useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  pointerWithin,
  useSensors,
  useSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { SmartPointerSensor } from "./PointerSensor";
import MasonryCard from "./MasonryCard";
import CardEditModal from "../CardEditModal";
import {
  getColumnsDimensions,
  getTallestColumn,
  getDataAsRows,
  sortElementsByHeight,
  getPositionRelativeToDocument,
  getColumnHeightAtRow,
  moveDataElement,
} from "./MasonryCards.util";
import useStore from "../../../hooks/useStore";
import useThrottledResize from "../../../hooks/useThrottledResize";
import {
  Card,
  ColumnDimensions,
  CardTransforms,
  MasonryCardsProps,
} from "../../../types/Card";
import "./MasonryCards.scss";

const MasonryCards: React.FC<MasonryCardsProps> = ({ data: dataInit }) => {
  const navIsOpen = useStore((state) => state.navIsOpen);
  const navIsHoverOpen = useStore((state) => state.navIsHoverOpen);
  const [data, setData] = useState<Card[]>(dataInit);
  const [mostRecentDraggedId, setMostRecentDraggedId] = useState<string | null>(
    null
  );
  const [currentDragOverId, setCurrentDragOverId] = useState<string | null>(
    null
  );
  const container = useRef<HTMLDivElement | null>(null);
  const [columnsDimensions, setColumnsDimensions] =
    useState<ColumnDimensions | null>(null);
  const [dataAsRows, setDataAsRows] = useState<Card[][] | null>(null);
  const dataAsRowsFlattened = JSON.stringify(dataAsRows);
  const topLeftCoordinates = { x: 0, y: 0 };
  const [cardTransforms, setCardTransforms] = useState<CardTransforms>({});
  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [editModalId, setEditModalId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(SmartPointerSensor));

  useEffect(() => {
    setData(dataInit);
  }, [dataInit]);

  const rowsAsElements =
    dataAsRows?.map((row) => {
      return row.map((card) => {
        return (
          container.current?.querySelector(`[data-id="${card?.id}"]`) || null
        );
      });
    }) || [];

  const resizeColumns = () => {
    const dimensions = getColumnsDimensions(container.current);
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
      setContainerHeight(getTallestColumn(container.current, dataAsRows));
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
        rowsAsElements
      );
      const x = parseInt(cardAbove?.getAttribute("data-x") || "0");
      cardElement.setAttribute("data-x", x.toString());
      cardElement.setAttribute("data-column", cardAboveColumn.toString());
      const y = Math.floor(
        0 - cardCoordinates.y + calcCardY + topLeftCoordinates.y
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
      // if first card, store top left co-ordinates
      topLeftCoordinates.x = cardCoordinates.x;
      topLeftCoordinates.y = cardCoordinates.y;
      cardTransforms[card?.id] = {
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
      cardTransforms[card?.id] = {
        x,
        y,
        width: columnsDimensions?.columnWidthPx || 0,
      };
    }
    setCardTransforms({ ...cardTransforms });
  };

  const init = (moveSourceId?: string, moveTargetId?: string) => {
    setCardTransforms({});
    // setColumnsDimensions(null);
    setDataAsRows(null);
    if (container.current) {
      const dimensions = getColumnsDimensions(container.current);

      // when dragging over target, swap the data elements to preview the new position
      const mutatedData = moveDataElement(
        data || null,
        moveSourceId,
        moveTargetId
      );
      setData(mutatedData);

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

  useEffect(resizeColumns, [container, data, dataAsRowsFlattened]);
  useEffect(() => {
    setTimeout(resizeColumns, 1000);
  }, [navIsOpen, navIsHoverOpen]);
  useEffect(init, [columnsDimensions]);
  useThrottledResize(init, 500);
  const containerStyles = {
    width: columnsDimensions
      ? columnsDimensions?.containerWidth + "px"
      : "auto",
    height: containerHeight ? containerHeight + "px" : "auto",
  };

  const handleDragStart = (event: DragStartEvent) => {
    setMostRecentDraggedId(event.active.id?.toString());
    setDragStartTime(new Date().getTime());
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const itemId = event.active.id?.toString();
    const elapsedTime = new Date().getTime() - dragStartTime;
    if (elapsedTime < 300) {
      setEditModalId(itemId);
    }
    init();
  };
  const handleDragOver = (event: DragOverEvent) => {
    const targetId = event.over?.id;
    const dragId = event.active.id;
    setCurrentDragOverId(targetId?.toString() || null);
    if (targetId && targetId !== dragId) {
      init(dragId?.toString(), targetId?.toString());
    }
  };

  const handleToggleSelectedCard = (id: string | undefined | null) => {
    if (!id) return;
    const newSelectedCards = selectedCards.includes(id)
      ? selectedCards.filter((card) => card !== id)
      : [...selectedCards, id];
    setSelectedCards(newSelectedCards);
  };
  const isCardSelected = (id: string) => {
    return selectedCards.includes(id);
  };

  console.log(selectedCards);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        ref={container}
        className="masonry-container"
        style={containerStyles}
      >
        {data?.map((card: Card, i) => (
          <MasonryCard
            key={card?.id || i}
            data={card}
            isCurrentTarget={currentDragOverId === card?.id}
            mostRecentDraggedCardId={mostRecentDraggedId}
            cardTransforms={cardTransforms}
            isSelected={isCardSelected(card?.id)}
            onToggle={(id: string) => handleToggleSelectedCard(id)}
          />
        ))}
      </div>
      <CardEditModal
        itemId={editModalId}
        onClose={() => setEditModalId(null)}
      />
    </DndContext>
  );
};

export default MasonryCards;
