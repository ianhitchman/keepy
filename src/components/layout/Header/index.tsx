import "./Header.scss";
import TopLeft from "../TopLeft";
import SearchBar from "../SearchBar";
import TopIcons from "../TopIcons";
const Header = () => {
  return (
    <header className="header">
      <TopLeft />
      <SearchBar />
      <TopIcons />
    </header>
  );
};

export default Header;
