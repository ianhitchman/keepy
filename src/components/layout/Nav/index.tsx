import { useState, useRef } from "react";
import { Button, Icon } from "@mui/material";
import * as icons from "@mui/icons-material";
import { Label } from "@mui/icons-material";
import navData from "../../../json/nav.json";
import useStore from "../../../hooks/useStore";
import { useFetchTags } from "../../../hooks/useFetchTags";

import "./Nav.scss";

// Define a type for icon names
type IconName = keyof typeof icons;
const navItems = navData?.map((item) => ({
  icon: icons[item.icon as IconName],
  text: item.text,
  page: item.page,
}));

const Nav = () => {
  const currentPage = useStore((state) => state.currentPage);
  const isNavOpen = useStore((state) => state.isNavOpen);
  const isNavHoverOpen = useStore((state) => state.isNavHoverOpen);
  const { data: tags } = useFetchTags();
  const setIsNavHoverOpen = useStore((state) => state.setIsNavHoverOpen);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const setIsSelectedOptionsShowing = useStore(
    (state) => state.setIsSelectedOptionsShowing
  );
  const setSelectedOptionIds = useStore((state) => state.setSelectedOptionIds);
  const setIsTransitionsPaused = useStore(
    (state) => state.setIsTransitionsPaused
  );
  const setFilterTags = useStore((state) => state.setFilterTags);

  const [currentButtonKey, setCurrentButtonKey] = useState(0);
  const hoverTimeout = useRef<number | null>(null);

  const isOpen = isNavOpen || isNavHoverOpen;

  const buttonWidth = isOpen ? "100%" : "0";
  const buttonPadding = isOpen ? "0 var(--padding) 0 var(--padding)" : "0";
  const buttonMargin = isOpen ? "0" : "0 0 0 var(--padding)";
  const buttonBorderRadius = isOpen ? "0" : "1.5rem";
  // const navYPosition = getYPosition();

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setIsNavHoverOpen(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setIsNavHoverOpen(false);
    }, 200);
  };

  const handleChangePage = (key: number) => {
    const page = navItems[key].page;
    // if we've changed the page, remove the selection options from header
    if (page !== currentPage) {
      setIsSelectedOptionsShowing(false);
      setSelectedOptionIds(new Set());
    }
    setCurrentPage(page);
    setCurrentButtonKey(key);
    setIsTransitionsPaused(true);
    setFilterTags([]);
    setIsNavHoverOpen(false);
  };

  const handleChangeTag = (tagId: string) => {
    handleChangePage(0);
    setFilterTags([tagId]);
  };

  return (
    <nav
      className="nav"
      data-open={isNavOpen}
      data-hover-open={isNavHoverOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      {tags &&
        tags?.length > 0 &&
        tags?.map((tag) => {
          const buttonLabel = isOpen ? tag.description : null;
          return (
            <Button
              key={tag.id}
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
                    color: tag.colour,
                    "& .MuiSvgIcon-root": {
                      display: "block",
                    },
                  }}
                >
                  <Label />
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
                backgroundColor: "transparent",
                justifyContent: "flex-start",
                transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
                textTransform: "none",
                color: "var(--colour-text)",
                "&:hover": {
                  border: 0,
                  backgroundColor: "var(--colour-secondary)",
                },
                "& .MuiButton-startIcon": {
                  marginLeft: "0",
                  marginRight: 0,
                },
              }}
              onClick={() => handleChangeTag(tag.id)}
            >
              {buttonLabel}
            </Button>
          );
        })}
    </nav>
  );
};

export default Nav;
