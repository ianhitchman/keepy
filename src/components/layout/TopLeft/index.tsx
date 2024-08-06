import BurgerButton from "../BurgerButton";
import Logo from "../Logo";
import "./TopLeft.scss";
const TopLeft = () => {
  return (
    <div className="top-left">
      <BurgerButton />
      <Logo />
    </div>
  );
};

export default TopLeft;
