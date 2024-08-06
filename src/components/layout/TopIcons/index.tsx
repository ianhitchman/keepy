import { IconButton } from "@mui/material";
import {
  RefreshOutlined,
  SettingsOutlined,
  SplitscreenOutlined,
} from "@mui/icons-material";
import("./TopIcons.scss");

const TopIcons = () => {
  return (
    <div className="top-icons">
      <IconButton size="large" color="inherit" aria-label="Refresh">
        <RefreshOutlined />
      </IconButton>
      <IconButton size="large" color="inherit" aria-label="View">
        <SplitscreenOutlined />
      </IconButton>
      <IconButton size="large" color="inherit" aria-label="Settings">
        <SettingsOutlined />
      </IconButton>
    </div>
  );
};

export default TopIcons;
