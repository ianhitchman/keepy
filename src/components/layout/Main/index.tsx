import { useState, useEffect } from "react";
import Home from "../../pages/Home";
import Nav from "../Nav";
import "./Main.scss";
import useStore from "../../../hooks/useStore";

const getNavWidth = () => {
  const nav = document.querySelector("nav.nav");
  if (nav) {
    return nav.getBoundingClientRect().width;
  }
  return 0;
};

const defaultWidth = () => {
  // get 1rem width in pixels
  const remWidth = getComputedStyle(document.documentElement).fontSize;
  return parseFloat(remWidth) * 3.5;
};

const Main = () => {
  const navIsOpen = useStore((state) => state.navIsOpen);
  const navIsHoverOpen = useStore((state) => state.navIsHoverOpen);
  const [navMarginOpen, setNavMarginOpen] = useState("280px");
  const [navMarginClosed, setNavMarginClosed] = useState(defaultWidth() + "px");

  useEffect(() => {
    if (navIsOpen && !navIsHoverOpen)
      setTimeout(() => {
        setNavMarginOpen(getNavWidth() + "px");
      }, 300);
    if (!navIsOpen && !navIsHoverOpen)
      setTimeout(() => {
        setNavMarginClosed(getNavWidth() + "px");
      }, 300);
  }, [navIsOpen, navIsHoverOpen]);

  const navMargin = navIsOpen ? navMarginOpen : navMarginClosed;

  return (
    <div className="main-layout">
      <Nav />
      <main className="main" style={{ marginLeft: navMargin }}>
        <Home />
      </main>
    </div>
  );
};

export default Main;
