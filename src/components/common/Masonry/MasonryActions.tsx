import { useRef, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Label,
  Palette,
  AddAlert,
  Image,
  Archive,
  Unarchive,
  Delete,
  RestoreFromTrash,
  Checklist,
} from "@mui/icons-material";
import { useFetchTasks } from "../../../hooks/useFetchTasks";
import ColourMenu from "../ColourMenu";
// import TagsMenu from "../TagsMenu";
import useStore from "../../../hooks/useStore";
// import { TagsData } from "../../../types/Card";

const MasonryActions: React.FC<{
  id?: string;
  multi?: Boolean;
  invert?: Boolean;
  list?: Boolean;
  setDraggingEnabled?: (enabled: boolean) => void;
  onUpdate?: (id: Array<string>, data: Record<string, any>) => void;
  onCreateList?: () => void;
}> = ({
  id,
  multi = false,
  invert = false,
  list = false,
  setDraggingEnabled,
  onUpdate,
  onCreateList,
}) => {
  const colourButtonRef = useRef<HTMLButtonElement>(null);
  const tagsButtonRef = useRef<HTMLButtonElement>(null);
  const [colourMenuOpen, setColourMenuOpen] = useState(false);
  const [tagsMenuOpen, setTagsMenuOpen] = useState(false);
  const selectedOptionIds = useStore((state) => state.selectedOptionIds);
  const currentPage = useStore((state) => state.currentPage);

  const { data } = useFetchTasks();
  const tasks =
    data?.filter((task) => {
      if (id) return task.id === id;
      return selectedOptionIds.has(task.id);
    }) || [];
  const taskIDs = tasks.map((task) => task.id);
  const task = id && tasks[0] ? tasks[0] : null;

  const handleCreateList = () => {
    if (onCreateList) {
      onCreateList();
    }
  };

  const icons = [
    {
      icon: <Label />,
      name: "label",
      label: "Labels",
      onClick: () => {
        setDraggingEnabled && setDraggingEnabled(false);
        setTagsMenuOpen(true);
      },
    },
    {
      icon: <Palette />,
      name: "color",
      label: "Background",
      onClick: () => {
        setDraggingEnabled && setDraggingEnabled(false);
        setColourMenuOpen(true);
      },
    },
    {
      icon: <AddAlert />,
      name: "alert",
      label: "Reminder",
    },
    {
      icon: <Image />,
      name: "image",
      label: "Add Image",
    },
    {
      icon: currentPage === "archive" ? <Unarchive /> : <Archive />,
      name: "archive",
      label: currentPage === "archive" ? "Unarchive" : "Archive",
      onClick: (_e: React.MouseEvent) => {
        if (onUpdate) {
          onUpdate(taskIDs, {
            isArchived: !task?.isArchived,
          });
        }
      },
    },
  ];
  // add 'new list' icon if enabled
  if (list && !multi) {
    const newItem = {
      icon: <Checklist />,
      name: "list",
      label: "New List",
      onClick: handleCreateList,
    };
    icons.splice(4, 0, newItem);
  }
  // remove image icon if multiple cards selected
  if (multi) {
    icons.splice(0, 1);
    icons.splice(2, 1);
  }
  // remove reminder icon if archive or bin
  else if (currentPage === "archive" || currentPage === "deleted") {
    icons.splice(2, 1);
    // add delete / undelete icon
    icons.push({
      icon: currentPage === "deleted" ? <RestoreFromTrash /> : <Delete />,
      name: "delete",
      label: currentPage === "deleted" ? "Undelete" : "Delete",
      onClick: (_e: React.MouseEvent) => {
        if (onUpdate) {
          console.log(task?.isDeleted);
          onUpdate(taskIDs, {
            isDeleted: !task?.isDeleted,
          });
        }
      },
    });
  }

  const handleCloseMenu = () => {
    setDraggingEnabled && setDraggingEnabled(true);
    setColourMenuOpen(false);
    setTagsMenuOpen(false);
  };

  const buttonSx = invert
    ? {
        color: "rgba(255,255,255,0.8)",
      }
    : {};

  // const tags = id && tasks[0] ? tasks[0].tags : undefined;
  const colour = id && tasks[0] ? tasks[0].colour : undefined;

  return (
    <>
      {icons.map((icon) => (
        <Tooltip title={icon.label} key={icon.name}>
          <IconButton
            ref={
              icon.name === "color"
                ? colourButtonRef
                : icon.name === "label"
                ? tagsButtonRef
                : null
            }
            aria-label={icon.label}
            sx={buttonSx}
            onClick={(e) => {
              e.stopPropagation();
              if (icon.onClick) {
                icon.onClick(e);
              }
            }}
          >
            {icon.icon}
          </IconButton>
        </Tooltip>
      ))}
      <ColourMenu
        anchorEl={colourButtonRef.current}
        open={colourMenuOpen}
        colour={colour}
        onClose={handleCloseMenu}
        onColourChange={(colour) => {
          if (onUpdate) {
            onUpdate(taskIDs, {
              colour,
            });
          }
        }}
      />
      {/* <TagsMenu
        anchorEl={tagsButtonRef.current}
        open={tagsMenuOpen}
        tags={tags}
        onClose={handleCloseMenu}
        onTagsChange={(tags: TagsData[]) => {
          if (onUpdate) {
            onUpdate(taskIDs, {
              tags,
            });
          }
        }}
      /> */}
    </>
  );
};

export default MasonryActions;
