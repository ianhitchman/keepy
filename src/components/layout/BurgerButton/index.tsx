import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import useStore from "../../../hooks/useStore";

import("./BurgerButton.scss");

const BurgerButton = () => {
  const isNavOpen = useStore((state) => state.isNavOpen);
  const setIsNavOpen = useStore((state) => state.setIsNavOpen);
  return (
    <div className="burger-button">
      <IconButton
        size="large"
        color="inherit"
        aria-label="Menu"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        <Menu />
      </IconButton>
    </div>
  );
};

export default BurgerButton;
