import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import useStore from "../../../hooks/useStore";

import("./BurgerButton.scss");

const BurgerButton = () => {
  const navIsOpen = useStore((state) => state.navIsOpen);
  const setNavIsOpen = useStore((state) => state.setNavIsOpen);
  return (
    <div className="burger-button">
      <IconButton
        size="large"
        color="inherit"
        aria-label="Menu"
        onClick={() => setNavIsOpen(!navIsOpen)}
      >
        <Menu />
      </IconButton>
    </div>
  );
};

export default BurgerButton;
