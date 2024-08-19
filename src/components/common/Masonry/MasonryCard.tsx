import utils from "../../../utils";
import { Card, CardTransforms } from "../../../types/Card";
import ImagesPreview from "../ImagesPreview";
import { Chip } from "@mui/material";

const MasonryCard: React.FC<{
  data: Card;
  cardTransforms: CardTransforms | null;
}> = ({ data, cardTransforms }) => {
  const getCardTransforms = (cardId: string) => {
    if (!cardTransforms)
      return {
        x: 0,
        y: 0,
        width: 0,
      };
    return cardTransforms[cardId];
  };

  const x = getCardTransforms(data.id)?.x + "px";
  const y = getCardTransforms(data.id)?.y + "px";
  const transform = `translate3d(${x}, ${y}, 0)`;
  const width =
    getCardTransforms(data.id)?.width > 0
      ? getCardTransforms(data.id)?.width + "px"
      : "auto";

  const imagePath = `http://localhost:8090/api/files/tasks/${data.id}/`;

  return (
    <div
      className="masonry-container__card"
      data-id={data.id}
      style={{
        transform: transform,
        width: width,
      }}
    >
      <div className="masonry-container__card__content">
        <h2>{data.title}</h2>
        <div className="masonry-container__card__content__text">
          {utils.truncateString(data.content || "", 500)}
        </div>
        {data.tags && data.tags.length > 0 && (
          <div className="masonry-container__card__content__tags">
            {data.tags.map((tag) => {
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
        {data.images && data.images.length > 0 && (
          <div className="masonry-container__card__content__image">
            <ImagesPreview path={imagePath} images={data.images || null} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MasonryCard;
