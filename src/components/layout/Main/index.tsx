import Home from "../../Pages/Home";
import Nav from "../Nav";
import "./Main.scss";
import useStore from "../../../hooks/useStore";

const Main = () => {
  const navIsOpen = useStore((state) => state.navIsOpen);
  const navIsHoverOpen = useStore((state) => state.navIsHoverOpen);

  const navMargin = navIsHoverOpen || !navIsOpen ? "50px" : "200px";

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
