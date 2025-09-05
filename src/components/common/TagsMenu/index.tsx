import { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  MenuList,
  TextField,
} from "@mui/material";
import { Label, MoreVert } from "@mui/icons-material";
import utils from "../../../utils";
import {
  useFetchTags,
  useDeleteTag,
  useUpdateTag,
  useCreateTag,
} from "../../../hooks/useFetchTags";
import { TagsData } from "../../../types/Card";
import ColourMenu from "../ColourMenu";

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
  const {
    mutate: deleteTag,
    isPending: isDeletingTag,
    isError: isDeleteError,
  } = useDeleteTag();
  const {
    mutate: updateTag,
    isPending: isUpdatingTag,
    isError: isUpdateError,
  } = useUpdateTag();
  const {
    mutate: createTag,
    isPending: isCreatingTag,
    isError: isCreateError,
  } = useCreateTag();
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [showMoreAnchor, setShowMoreAnchor] = useState<HTMLElement | null>(
    null
  );
  const [colourMenuTrigger, setColourMenuTrigger] =
    useState<HTMLElement | null>(null);

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

  const selectedTag =
    tagsData && showMoreMenu
      ? tagsData.find((tag) => {
          return tag.id === showMoreMenu;
        })
      : null;

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

  const handleDeleteTag = () => {
    const tagId = showMoreMenu;
    if (!tagId) return;
    deleteTag({ id: tagId });
    setShowMoreMenu(null);
  };

  const handleMoreMenu = (e: React.MouseEvent<HTMLElement>, tagId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreMenu(tagId ?? null);
    setShowMoreAnchor(e.currentTarget);
  };

  const handleSelectColour = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const trigger = e.target as HTMLElement;
    setColourMenuTrigger(trigger);
  };

  const handleCloseColour = () => {
    setColourMenuTrigger(null);
  };

  const handleSetColour = (colour: string) => {
    updateTag({
      id: selectedTag?.id,
      body: {
        colour,
      },
    });
    setColourMenuTrigger(null);
    setShowMoreMenu(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === "Enter") {
      const target = e.target as HTMLInputElement;
      const value = target?.value;
      target.value = "";
      createTag({
        body: {
          description: value,
        },
      });
    }
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
                  color: utils.getColourFromName(tag.colour),
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
          onKeyDown={handleAddTag}
          sx={{
            margin: "0 0.5rem",
          }}
        />
      </Menu>
      <Menu
        anchorEl={showMoreAnchor}
        open={!!showMoreMenu}
        onClose={() => setShowMoreMenu(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <MenuList dense sx={{ padding: 0 }}>
          <MenuItem
            onClick={(e) => {
              handleSelectColour(e);
            }}
          >
            Set colour
          </MenuItem>
          <MenuItem onClick={handleDeleteTag}>Remove tag</MenuItem>
        </MenuList>
      </Menu>
      <ColourMenu
        anchorEl={colourMenuTrigger}
        open={!!colourMenuTrigger}
        colour={selectedTag?.colour}
        onClose={handleCloseColour}
        onColourChange={handleSetColour}
      />
    </>
  );
};

export default TagsMenu;
