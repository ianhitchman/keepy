import { IconButton } from "@mui/material";
import { Label, Palette, AddAlert, Image, Archive } from "@mui/icons-material";

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
  },
];

const MasonryActions: React.FC<{
  id: string | null;
}> = ({ id }) => {
  if (!id) return null;
  return (
    <>
      {icons.map((icon) => (
        <IconButton
          key={icon.name}
          onClick={() => {
            console.log(icon.name);
          }}
        >
          {icon.icon}
        </IconButton>
      ))}
    </>
  );
};

export default MasonryActions;
