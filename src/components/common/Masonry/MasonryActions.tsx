import { IconButton } from "@mui/material";
import { Label, Palette, AddAlert, Image, Archive } from "@mui/icons-material";
import { useFetchTasks } from "../../../hooks/useFetchTasks";

const MasonryActions: React.FC<{
  id: string | null;
  onUpdate?: (id: string, data: Record<string, any>) => void;
}> = ({ id, onUpdate }) => {
  if (!id) return null;
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
    </>
  );
};

export default MasonryActions;
