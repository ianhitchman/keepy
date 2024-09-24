import "./Header.scss";
import TopLeft from "../TopLeft";
import SearchBar from "../SearchBar";
import TopIcons from "../TopIcons";
import SelectionActions from "../../common/SelectionActions";
import useStore from "../../../hooks/useStore";
const Header = () => {
  const isSelectedOptionsShowing = useStore(
    (state) => state.isSelectedOptionsShowing
  );
  return (
    <header className="header">
      <TopLeft />
      <SearchBar />
      <TopIcons />
      {isSelectedOptionsShowing && <SelectionActions />}
    </header>
  );
};

export default Header;
