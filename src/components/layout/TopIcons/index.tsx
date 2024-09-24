import { IconButton } from "@mui/material";
import {
  RefreshOutlined,
  SettingsOutlined,
  SplitscreenOutlined,
  GridView,
} from "@mui/icons-material";
import("./TopIcons.scss");
import useStore from "../../../hooks/useStore";

const TopIcons = () => {
  const isTilesView = useStore((state) => state.isTilesView);
  const setIsTilesView = useStore((state) => state.setIsTilesView);
  const viewLabel = isTilesView ? "List view" : "Tiles view";
  const ViewIcon = isTilesView ? GridView : SplitscreenOutlined;

  return (
    <div className="top-icons">
      <IconButton
        size="large"
        color="inherit"
        title="Refresh"
        aria-label="Refresh"
      >
        <RefreshOutlined />
      </IconButton>
      <IconButton
        size="large"
        color="inherit"
        title={viewLabel}
        aria-label={viewLabel}
        onClick={() => setIsTilesView(!isTilesView)}
      >
        <ViewIcon />
      </IconButton>
      <IconButton
        size="large"
        color="inherit"
        title="Settings"
        aria-label="Settings"
      >
        <SettingsOutlined />
      </IconButton>
    </div>
  );
};

export default TopIcons;
