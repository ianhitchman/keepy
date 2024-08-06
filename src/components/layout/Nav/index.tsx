import { useState, useRef } from "react";
import { Button, Icon } from "@mui/material";
import * as icons from "@mui/icons-material";
import navData from "../../../json/nav.json";
import useStore from "../../../hooks/useStore";

import "./Nav.scss";

// get y position of <main> element relative to the top of the page
const getYPosition = () => {
  const main = document.querySelector("main");
  if (main) {
    return main.getBoundingClientRect().top;
  }
  return 0;
};

// Define a type for icon names
type IconName = keyof typeof icons;
const navItems = navData?.map((item) => ({
  icon: icons[item.icon as IconName],
  text: item.text,
  page: item.page,
}));

const Nav = () => {
  const navIsOpen = useStore((state) => state.navIsOpen);
  const navIsHoverOpen = useStore((state) => state.navIsHoverOpen);
  const setNavIsHoverOpen = useStore((state) => state.setNavIsHoverOpen);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  const [currentButtonKey, setCurrentButtonKey] = useState(0);
  const hoverTimeout = useRef<number | null>(null);

  const isOpen = navIsOpen || navIsHoverOpen;

  const buttonWidth = isOpen ? "100%" : "0";
  const buttonPadding = isOpen ? "0 var(--padding) 0 var(--padding)" : "0";
  const buttonMargin = isOpen ? "0" : "0 0 0 var(--padding)";
  const buttonBorderRadius = isOpen ? "0" : "1.5rem";
  const navYPosition = getYPosition();
  const navHeight = `calc(100% - ${navYPosition}px)`; //navIsHoverOpen ? `calc(100% - ${navYPosition}px)` : "auto";

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setNavIsHoverOpen(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setNavIsHoverOpen(false);
    }, 200);
  };

  const handleChangePage = (key: number) => {
    setCurrentPage(navItems[key].page);
    setCurrentButtonKey(key);
  };

  return (
    <nav
      className="nav"
      data-open={navIsOpen}
      data-hover-open={navIsHoverOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ top: `${navYPosition}px`, height: navHeight }}
    >
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        const buttonLabel = isOpen ? item.text : null;
        const buttonBackground =
          index === currentButtonKey ? "var(--colour-primary)" : "transparent";
        const buttonBackgroundHover =
          index === currentButtonKey
            ? "var(--colour-primary)"
            : "var(--colour-secondary)";
        return (
          <Button
            key={index}
            variant="outlined"
            disableElevation
            size="large"
            startIcon={
              <Icon
                fontSize="large"
                color="inherit"
                aria-label="Menu"
                sx={{
                  padding: "0.75rem",
                  width: "fit-content",
                  height: "fit-content",
                  display: "block",
                  "& .MuiSvgIcon-root": {
                    display: "block",
                  },
                }}
              >
                <IconComponent />
              </Icon>
            }
            sx={{
              display: "flex",
              width: buttonWidth,
              padding: buttonPadding,
              margin: buttonMargin,
              minWidth: "fit-content",
              border: 0,
              borderRadius: buttonBorderRadius,
              borderTopRightRadius: "1.5rem",
              borderBottomRightRadius: "1.5rem",
              borderColor: "transparent",
              backgroundColor: buttonBackground,
              justifyContent: "flex-start",
              transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
              textTransform: "none",
              color: "var(--colour-text)",
              "&:hover": {
                border: 0,
                backgroundColor: buttonBackgroundHover,
              },
              "& .MuiButton-startIcon": {
                marginLeft: "0",
                marginRight: 0,
              },
            }}
            onClick={() => handleChangePage(index)}
          >
            {buttonLabel}
          </Button>
        );
      })}
    </nav>
  );
};

export default Nav;
