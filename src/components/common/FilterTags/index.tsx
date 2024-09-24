import { Chip } from "@mui/material";
import utils from "../../../utils";
import useStore from "../../../hooks/useStore";
import { useFetchTags } from "../../../hooks/useFetchTags";
import "./FilterTags.scss";

const FilterTags = () => {
  const filterTags = useStore((state) => state.filterTags);
  const setFilterTags = useStore((state) => state.setFilterTags);
  const { data: tags } = useFetchTags();

  if (!filterTags || filterTags?.length <= 0) return <></>;

  const handleRemoveTag = (tagId: string) => {
    const newFilterTags = filterTags.filter((tag) => tag !== tagId);
    setFilterTags(newFilterTags);
  };

  return (
    <div className="filter-tags">
      {filterTags.map((tagId) => {
        const tag = tags?.find((t) => t.id === tagId);
        return (
          <Chip
            key={tag?.id}
            label={tag?.description}
            size="medium"
            onDelete={() => {
              handleRemoveTag(tagId);
            }}
            sx={{
              backgroundColor: tag?.colour,
              color: utils.getContrastingColor(tag?.colour || null),
              fontSize: "1rem",
              "& .MuiSvgIcon-root": {
                color: utils.getContrastingColor(tag?.colour || null),
                opacity: "0.5",
              },
              "& .MuiSvgIcon-root:hover": {
                color: utils.getContrastingColor(tag?.colour || null),
                opacity: "1",
              },
            }}
          />
        );
      })}
    </div>
  );
};

export default FilterTags;
