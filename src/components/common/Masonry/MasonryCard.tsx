import { useEffect, useState } from "react";
import { DraggableAttributes, useDraggable, useDroppable } from "@dnd-kit/core";
import utils from "../../../utils";
import MasonryActions from "./MasonryActions";
import { Card, CardTransforms } from "../../../types/Card";
import ImagesPreview from "../ImagesPreview";
import { Chip, IconButton } from "@mui/material";
import { CheckCircleOutline, CheckCircle } from "@mui/icons-material";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const MasonryCard: React.FC<{
  data: Card;
  isCurrentTarget: boolean;
  mostRecentDraggedCardId: string | null;
  cardTransforms: CardTransforms | null;
  isSelected?: boolean;
  onToggle?: (id: string) => void;
}> = ({
  data,
  isCurrentTarget,
  mostRecentDraggedCardId,
  cardTransforms,
  isSelected = false,
  onToggle,
}) => {
  const getCardTransforms = (cardId: string) => {
    if (!cardTransforms)
      return {
        x: 0,
        y: 0,
        width: 0,
      };
    return cardTransforms[cardId];
  };

  const [draggingTransforms, setDraggingTransforms] = useState({
    x: getCardTransforms(data?.id)?.x,
    y: getCardTransforms(data?.id)?.y,
  });

  const {
    attributes,
    listeners,
    setNodeRef: dragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: data?.id,
  });

  useEffect(() => {
    if (isDragging) {
      const x = getCardTransforms(data?.id)?.x;
      const y = getCardTransforms(data?.id)?.y;

      setDraggingTransforms({
        x,
        y,
      });
    }
  }, [isDragging]);

  const { setNodeRef: dropRef } = useDroppable({
    id: data?.id,
  });

  const initX = isDragging
    ? draggingTransforms.x
    : getCardTransforms(data?.id)?.x;
  const initY = isDragging
    ? draggingTransforms.y
    : getCardTransforms(data?.id)?.y;
  const calculatedX = initX + (transform?.x || 0);
  const calculatedY = initY + (transform?.y || 0);

  const disableTransition =
    (transform?.x && transform?.x > 0) || (transform?.y && transform?.y > 0)
      ? true
      : false;

  const x = calculatedX + "px";
  const y = calculatedY + "px";
  const transformString = `translate3d(${x}, ${y}, 0)`;
  const width =
    getCardTransforms(data?.id)?.width > 0
      ? getCardTransforms(data?.id)?.width + "px"
      : "auto";

  const cardStyles = {
    transform: transformString,
    width: width,
  };
  const placeholderStyles = {
    transform: `translate3d(${getCardTransforms(data?.id)?.x}px, ${
      getCardTransforms(data?.id)?.y
    }px, 0)`,
    position: "absolute",
    width: width,
    opacity: "0",
  };
  const isCurrentCard = mostRecentDraggedCardId === data?.id ? true : false;

  const dataAttributes = {
    "data-disable-transition": disableTransition.toString(),
    "data-id": data?.id.toString(),
    "data-is-current-card": isCurrentCard.toString(),
    "data-is-current-target": isCurrentTarget.toString(),
  };
  return (
    <>
      {isDragging && isCurrentCard && (
        <MasonryCardComponent data={data} cardStyles={placeholderStyles} />
      )}
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
}) => {
  if (!data) return null;
  const imagePath = `http://localhost:8090/api/files/tasks/${data?.id}/`;
  const hasImages = !!(data.images && data.images.length > 0);
  const hasTags = !!(data.tags && data.tags.length > 0);
  const floatActions = !!(hasImages || !hasTags);
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
        {selectable && (
          <IconButton
            className="masonry-container__card__content__icon"
            onClick={() => {
              console.log("onToggle", data?.id?.toString());
              onToggle && onToggle(data?.id?.toString());
            }}
          >
            {isSelected ? <CheckCircle /> : <CheckCircleOutline />}
          </IconButton>
        )}
        <h2>{data.title}</h2>
        <div className="masonry-container__card__content__text">
          {utils.truncateString(data.content || "", 500)}
        </div>
        {hasTags && (
          <div className="masonry-container__card__content__tags">
            {data?.tags?.map((tag: any) => {
              return (
                <Chip
                  key={tag.id}
                  label={tag.description}
                  size="small"
                  onDelete={() => null}
                  sx={{
                    backgroundColor: tag.colour,
                    color: utils.getContrastingColor(tag.colour || null),
                    "& .MuiSvgIcon-root": {
                      color: utils.getContrastingColor(tag.colour || null),
                      opacity: "0.5",
                    },
                    "& .MuiSvgIcon-root:hover": {
                      color: utils.getContrastingColor(tag.colour || null),
                      opacity: "1",
                    },
                  }}
                />
              );
            })}
          </div>
        )}
        {hasImages && (
          <div className="masonry-container__card__content__image">
            <ImagesPreview path={imagePath} images={data.images || null} />
          </div>
        )}

        <div
          className="masonry-container__card__content__actions"
          data-float={floatActions}
        >
          <MasonryActions id={data?.id} />
        </div>
      </div>
    </div>
  );
};

export default MasonryCard;
