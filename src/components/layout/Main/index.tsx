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
  const isNavOpen = useStore((state) => state.isNavOpen);
  const isNavHoverOpen = useStore((state) => state.isNavHoverOpen);
  const [navMarginOpen, setNavMarginOpen] = useState("280px");
  const [navMarginClosed, setNavMarginClosed] = useState(defaultWidth() + "px");

  useEffect(() => {
    if (isNavOpen && !isNavHoverOpen)
      setTimeout(() => {
        setNavMarginOpen(getNavWidth() + "px");
      }, 300);
    if (!isNavOpen && !isNavHoverOpen)
      setTimeout(() => {
        setNavMarginClosed(getNavWidth() + "px");
      }, 300);
  }, [isNavOpen, isNavHoverOpen]);

  const navMargin = isNavOpen ? navMarginOpen : navMarginClosed;

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
