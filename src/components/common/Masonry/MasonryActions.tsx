import { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { Label, Palette, AddAlert, Image, Archive } from "@mui/icons-material";
import { useFetchTasks } from "../../../hooks/useFetchTasks";
import ColourMenu from "../ColourMenu";

const MasonryActions: React.FC<{
  id: string | null;
  setDraggingEnabled?: (enabled: boolean) => void;
  onUpdate?: (id: string, data: Record<string, any>) => void;
}> = ({ id, setDraggingEnabled, onUpdate }) => {
  if (!id) return null;
  const colourButtonRef = useRef<HTMLButtonElement>(null);
  const [colourMenuOpen, setColourMenuOpen] = useState(false);

  const { data } = useFetchTasks();
  const task = data?.find((task) => task.id === id);

  const icons = [
    {
      icon: <Label />,
      name: "label",
      label: "Labels",
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
      icon: <Archive />,
      name: "archive",
      label: "Archive",
      onClick: (_e: React.MouseEvent, id: string) => {
        onUpdate &&
          onUpdate(id, {
            isArchived: !task?.isArchived,
          });
      },
    },
  ];

  return (
    <>
      {icons.map((icon) => (
        <IconButton
          key={icon.name}
          ref={icon.name === "color" ? colourButtonRef : null}
          onClick={(e) => {
            e.stopPropagation();
            if (icon.onClick) {
              icon.onClick(e, id);
            }
          }}
        >
          {icon.icon}
        </IconButton>
      ))}
      <ColourMenu
        anchorEl={colourButtonRef.current}
        open={colourMenuOpen}
        colour={task?.colour}
        onClose={() => {
          setDraggingEnabled && setDraggingEnabled(true);
          setColourMenuOpen(false);
        }}
        onColourChange={(colour) => {
          onUpdate &&
            onUpdate(id, {
              colour,
            });
        }}
      />
    </>
  );
};

export default MasonryActions;
