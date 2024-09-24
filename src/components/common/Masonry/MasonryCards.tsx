import { useState, useRef, useEffect, useCallback } from "react";
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
import FilterTags from "../FilterTags";
import { Card, MasonryCardsProps } from "../../../types/Card";
import useMasonry from "./useMasonry";
import { moveDataElement, getCardTransforms } from "./MasonryCards.util";
import useStore from "../../../hooks/useStore";

import "./MasonryCards.scss";

const MasonryCards: React.FC<MasonryCardsProps> = ({
  data: dataInit,
  onSave,
}) => {
  const [data, setData] = useState<Card[]>(dataInit);
  const [mutatedData, setMutatedData] = useState<Card[]>(dataInit);
  useEffect(() => {
    setData(dataInit);
    setMutatedData(dataInit);
  }, [dataInit]);

  const [mostRecentDraggedId, setMostRecentDraggedId] = useState<string | null>(
    null
  );
  const [currentDragOverId, setCurrentDragOverId] = useState<string | null>(
    null
  );
  const [dragStartTime, setDragStartTime] = useState(0);
  const [editModalId, setEditModalId] = useState<string | null>(null);
  const currentPage = useStore((state) => state.currentPage);
  const selectedOptionIds = useStore((state) => state.selectedOptionIds);
  const setSelectedOptionIds = useStore((state) => state.setSelectedOptionIds);
  const setSelectedOptionsShowing = useStore(
    (state) => state.setIsSelectedOptionsShowing
  );
  const isTilesView = useStore((state) => state.isTilesView);

  const container = useRef<HTMLDivElement | null>(null);
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const defaultColumnWidth = 256;
  const defaultFullWidth = 600;

  const { containerWidth, containerHeight, columnCount, cards } = useMasonry({
    data: mutatedData,
    container,
    options: {
      columnWidth: isTilesView ? defaultColumnWidth : defaultFullWidth,
      columns: isTilesView ? undefined : 1,
    },
  });
  const isTransitionsPaused = columnCount === 1;

  const handleDragStart = (event: DragStartEvent) => {
    setMostRecentDraggedId(event.active.id?.toString());
    setDragStartTime(new Date().getTime());
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const itemId = event.active.id?.toString();
    const elapsedTime = new Date().getTime() - dragStartTime;
    if (elapsedTime < 300) {
      return setEditModalId(itemId);
    }
    handleSavePositions();
  };
  const handleDragOver = (event: DragOverEvent) => {
    const targetId = event.over?.id;
    const dragId = event.active.id;
    setCurrentDragOverId(targetId?.toString() || null);
    if (targetId && targetId !== dragId) {
      setMutatedData(
        moveDataElement(mutatedData, dragId?.toString(), targetId?.toString())
      );
    }
  };
  const handleSavePositions = () => {
    const positions: Record<string, number> = {};
    mutatedData.forEach((card, i) => {
      positions[card?.id] = i;
    });

    onSave?.("config", { taskPositions: positions });
  };

  const handleToggleSelectedCard = useCallback(
    (id: string) => {
      const newSelectedOptionIds = new Set(selectedOptionIds);
      if (newSelectedOptionIds.has(id)) {
        newSelectedOptionIds.delete(id);
      } else {
        newSelectedOptionIds.add(id);
      }
      setSelectedOptionIds(newSelectedOptionIds);
      setSelectedOptionsShowing(newSelectedOptionIds.size > 0);
    },
    [selectedOptionIds]
  );

  const handleUpdate = useCallback(
    (id: string, updateData: Record<string, any>) => {
      console.log(id, updateData);
      const currentData = [...data]; // If `data` is being updated in the parent component, make sure this reference is memoized.
      let itemIndex = currentData.findIndex((card) => card?.id === id);
      if (itemIndex < 0) return;
      const item = { ...currentData[itemIndex], ...updateData };
      currentData[itemIndex] = item;

      // hide archived cards
      if (
        (updateData.isArchived && currentPage !== "archive") ||
        (!updateData.isArchived && currentPage === "archive")
      ) {
        currentData.splice(itemIndex, 1);
      }

      setMutatedData([...currentData]);
      onSave?.("task", item);
    },
    [data, currentPage]
  );

  const containerStyles = {
    width: containerWidth ? containerWidth + "px" : defaultColumnWidth + "px",
    height: containerHeight ? containerHeight + "px" : "auto",
  };

  return (
    <>
      <FilterTags />
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
          data-transitions-paused={isTransitionsPaused}
        >
          {mutatedData?.map((card: Card, i) => (
            <MasonryCard
              key={card?.id || i}
              data={card}
              transforms={getCardTransforms(
                card?.id,
                cards,
                defaultColumnWidth
              )}
              isCurrentTarget={currentDragOverId === card?.id}
              mostRecentDraggedCardId={mostRecentDraggedId}
              isSelected={selectedOptionIds?.has(card?.id)}
              onToggle={handleToggleSelectedCard}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
        <CardEditModal
          itemId={editModalId}
          onClose={() => setEditModalId(null)}
        />
      </DndContext>
    </>
  );
};

export default MasonryCards;
