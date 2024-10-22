import { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  MenuList,
  TextField,
} from "@mui/material";
import { Label, MoreVert } from "@mui/icons-material";
import { useFetchTags } from "../../../hooks/useFetchTags";
import { TagsData } from "../../../types/Card";

interface TagsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  tags?: string[];
  onClose: () => void;
  onTagsChange?: (tags: TagsData[]) => void;
}

const TagsMenu = ({
  anchorEl,
  open,
  tags: initTags = [],
  onClose,
  onTagsChange,
}: TagsMenuProps) => {
  const [tags, setTags] = useState(initTags);

  const { data: allTags } = useFetchTags();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMoreAnchor, setShowMoreAnchor] = useState<HTMLElement | null>(
    null
  );

  const tagsData: TagsData[] = (allTags || []).map((tag) => {
    const { id, description, colour } = tag;
    return {
      id,
      description,
      colour,
    };
  });

  useEffect(() => {
    setTags(initTags);
  }, [initTags]);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleToggleTag = (tagId?: string) => {
    if (!tagId) return;
    const newTags = tags.includes(tagId)
      ? tags.filter((tag) => tag !== tagId)
      : [...tags, tagId];
    const newTagsData = newTags.map((tag) =>
      tagsData.find((t) => t.id === tag)
    ) as TagsData[];
    onTagsChange && onTagsChange(newTagsData);
    setTags(newTags);
  };

  const handleMoreMenu = (e: React.MouseEvent<HTMLElement>, tagId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreMenu(true);
    setShowMoreAnchor(e.currentTarget);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{}}
      >
        <MenuList dense sx={{ padding: 0 }}>
          {allTags?.map((tag) => (
            <MenuItem
              key={tag.id}
              sx={{
                paddingRight: "0.25rem",
                display: "flex",
                width: "100%",
                "> *": {
                  flexShrink: 1,
                },
              }}
              onClick={() => handleToggleTag(tag.id)}
            >
              <Label
                sx={{
                  color: tag.colour,
                }}
              />
              <Checkbox checked={tags.includes(tag.id)} />
              <div style={{ flexGrow: 1 }}>{tag.description}</div>
              <IconButton
                onClick={(e) => {
                  handleMoreMenu(e, tag.id);
                }}
              >
                <MoreVert />
              </IconButton>
            </MenuItem>
          ))}
        </MenuList>
        <TextField
          placeholder="Add tag"
          variant="standard"
          sx={{
            margin: "0 0.5rem",
          }}
        />
      </Menu>
      <Menu
        anchorEl={showMoreAnchor}
        open={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <MenuList dense sx={{ padding: 0 }}>
          <MenuItem>Set colour</MenuItem>
          <MenuItem>Remove tag</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default TagsMenu;
