import { useState, useEffect } from "react";
import { Menu, IconButton } from "@mui/material";
import { FormatColorReset } from "@mui/icons-material";
import colours from "../../../json/colours.json";

interface ColourMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onColourChange?: (colour: string) => void;
  colour?: string;
}

const ColourMenu = ({
  anchorEl,
  open,
  onClose,
  onColourChange,
  colour: initColour,
}: ColourMenuProps) => {
  const [colour, setColour] = useState(initColour);
  useEffect(() => {
    setColour(initColour);
  }, [initColour]);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const allColours = [
    {
      name: "None",
      value: "",
      light: "",
      lightOverlay: "",
      dark: "",
    },
    ...colours.map((c) => ({
      name: c.name,
      value: c.name,
      light: c.light,
      lightOverlay: c.lightOverlay,
      dark: c.dark,
    })),
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiMenu-list": {
          padding: "0.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        },
      }}
    >
      {allColours.map((c) => (
        <IconButton
          title={c.name}
          sx={{
            backgroundColor: c?.light,
            width: "2rem",
            height: "2rem",
            margin: "0.112rem",
            border: c.value === colour?.toString() ? "2px solid black" : "none",
            "&:hover": {
              backgroundColor: c?.lightOverlay,
            },
          }}
          onClick={() => {
            onColourChange && onColourChange(c.value);
            setColour(c.value);
          }}
        >
          {c.name === "None" ? <FormatColorReset /> : null}
        </IconButton>
      ))}
    </Menu>
  );
};

export default ColourMenu;
