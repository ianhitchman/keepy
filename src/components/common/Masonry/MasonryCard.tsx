import { useEffect, useState, useMemo, useCallback } from "react";
import { DraggableAttributes, useDraggable, useDroppable } from "@dnd-kit/core";
import { Alarm } from "@mui/icons-material";
import utils from "../../../utils";
import MasonryActions from "./MasonryActions";
import { Card } from "../../../types/Card";
import ImagesPreview from "../ImagesPreview";
import { Chip, IconButton } from "@mui/material";
import { CheckCircleOutline, CheckCircle } from "@mui/icons-material";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const MasonryCard: React.FC<{
  data: Card;
  transforms: { x: number; y: number; width: number | string };
  isCurrentTarget: boolean;
  mostRecentDraggedCardId: string | null;
  isSelected?: boolean;
  onToggle?: (id: string) => void;
  onUpdate?: (id: string, data: Record<string, any>) => void;
}> = ({
  data,
  transforms: transformsInit,
  isCurrentTarget,
  mostRecentDraggedCardId,
  isSelected = false,
  onToggle,
  onUpdate,
}) => {
  const [transforms, setTransforms] = useState(transformsInit);
  const [preDraggingTransforms, setPreDraggingTransforms] =
    useState(transformsInit);

  // Use dnd-kit hooks for draggable and droppable behavior
  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform: dragTransforms,
    isDragging,
  } = useDraggable({ id: data?.id });
  const { setNodeRef: dropRef } = useDroppable({ id: data?.id });

  // Handle updating transforms based on dragging state and initial transforms
  useEffect(() => {
    setTransforms(transformsInit);
    if (!isDragging) {
      setPreDraggingTransforms(transformsInit);
    }
  }, [transformsInit, isDragging]);

  // Calculate the card's position during dragging
  const transformProps = useMemo(() => {
    return isDragging
      ? {
          ...preDraggingTransforms,
          x: preDraggingTransforms.x + (dragTransforms?.x || 0),
          y: preDraggingTransforms.y + (dragTransforms?.y || 0),
        }
      : transforms;
  }, [isDragging, preDraggingTransforms, dragTransforms, transforms]);

  // Memoize the card's inline styles
  const cardStyles = useMemo(
    () => ({
      width:
        typeof transforms.width === "number" ? `${transforms.width}px` : "auto",
      transform: `translate3d(${transformProps.x}px, ${transformProps.y}px, 0)`,
    }),
    [transformProps.x, transformProps.y, transforms.width]
  );

  const isCurrentCard = mostRecentDraggedCardId === data?.id;

  const dataAttributes = useMemo(
    () => ({
      "data-disable-transition": isDragging.toString(),
      "data-id": data?.id.toString(),
      "data-is-current-card": isCurrentCard.toString(),
      "data-is-current-target": isCurrentTarget.toString(),
    }),
    [isDragging, isCurrentCard, isCurrentTarget, data?.id]
  );

  return (
    <>
      <MasonryCardComponent
        dragRef={dragRef}
        dropRef={dropRef}
        data={data}
        attributes={attributes}
        listeners={listeners}
        dataAttributes={dataAttributes}
        selectable={true}
        isSelected={isSelected}
        isDragging={isDragging}
        cardStyles={cardStyles}
        onToggle={onToggle}
        onUpdate={onUpdate}
      />
    </>
  );
};

const MasonryCardComponent: React.FC<{
  dragRef?: (el: HTMLElement | null) => void;
  dropRef?: (el: HTMLElement | null) => void;
  data: Card;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  dataAttributes?: { [key: string]: string };
  cardStyles?: { [key: string]: string };
  selectable?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  onToggle?: (id: string) => void;
  onUpdate?: (id: string, data: Record<string, any>) => void;
}> = ({
  dragRef,
  dropRef,
  data,
  attributes,
  listeners,
  dataAttributes,
  cardStyles,
  selectable = false,
  isSelected = false,
  isDragging = false,
  onToggle,
  onUpdate,
}) => {
  if (!data) return null;

  // Memoize everything to optimise drag and drop smoothness
  const imagePath = useMemo(
    () => `http://localhost:8090/api/files/tasks/${data?.id}/`,
    [data?.id]
  );
  const hasImages = useMemo(
    () => data?.images && data.images.length > 0,
    [data.images]
  );
  const hasTags = useMemo(
    () => data?.tags && data.tags.length > 0,
    [data.tags]
  );
  const hasReminder = useMemo(() => !!data?.reminderDate, [data?.reminderDate]);
  const floatActions = useMemo(
    () => hasImages || !hasTags,
    [hasImages, hasTags]
  );

  const handleToggle = useCallback(() => {
    onToggle?.(data?.id?.toString());
  }, [onToggle, data?.id]);

  const memoizedStaticContent = useMemo(() => {
    return (
      <>
        {selectable && (
          <IconButton
            className="masonry-container__card__content__icon"
            onClick={handleToggle}
          >
            {isSelected ? <CheckCircle /> : <CheckCircleOutline />}
          </IconButton>
        )}
        <h2>{data.title}</h2>
        <div className="masonry-container__card__content__text">
          {utils.truncateString(data.content, 500)}
        </div>
        {(hasTags || hasReminder) && (
          <div className="masonry-container__card__content__tags">
            {hasReminder && (
              <Chip
                label={utils.getFormattedDateTime(data.reminderDate)}
                size="small"
                icon={<Alarm />}
              />
            )}
            {data?.tags?.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.description}
                size="small"
                sx={{
                  backgroundColor: tag.colour,
                  color: utils.getContrastingColor(tag.colour),
                }}
              />
            ))}
          </div>
        )}
        {hasImages && (
          <div className="masonry-container__card__content__image">
            <ImagesPreview path={imagePath} images={data.images} />
          </div>
        )}
        <div
          className="masonry-container__card__content__actions"
          data-float={floatActions}
        >
          <MasonryActions id={data?.id} onUpdate={onUpdate} />
        </div>
      </>
    );
  }, [
    selectable,
    isSelected,
    handleToggle,
    data,
    hasTags,
    hasReminder,
    hasImages,
    imagePath,
    floatActions,
    onUpdate,
  ]);

  return (
    <div
      className="masonry-container__card"
      data-is-selected={isSelected}
      data-is-dragging={isDragging}
      ref={dragRef}
      {...attributes}
      {...listeners}
      {...dataAttributes}
      style={cardStyles}
    >
      <div className="masonry-container__card__content" ref={dropRef}>
        {memoizedStaticContent}
      </div>
    </div>
  );
};

export default MasonryCard;
