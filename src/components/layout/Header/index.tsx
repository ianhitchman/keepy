import "./Header.scss";
import TopLeft from "../TopLeft";
import SearchBar from "../SearchBar";
import TopIcons from "../TopIcons";
import SelectionActions from "../../common/SelectionActions";
const Header = () => {
  return (
    <header className="header">
      <TopLeft />
      <SearchBar />
      <TopIcons />
      <SelectionActions />
    </header>
  );
};

export default Header;
