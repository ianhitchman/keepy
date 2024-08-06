import { Typography, Link } from "@mui/material";
import useStore from "../../../hooks/useStore";
import LogoImage from "../../../assets/logo.svg";
import navData from "../../../json/nav.json";

import "./Logo.scss";
const Logo = () => {
  const currentPage = useStore((state) => state.currentPage);
  const pageDetails = navData.find((page) => page.page === currentPage);
  if (currentPage && pageDetails?.text) {
    return (
      <Typography variant="h6" component="h1">
        {pageDetails?.text}
      </Typography>
    );
  }
  return (
    <Link href="/" underline="none">
      <img src={LogoImage} alt="logo" className="logo" />
    </Link>
  );
};

export default Logo;
