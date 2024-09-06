import { IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import MasonryActions from "../Masonry/MasonryActions";
import "./SelectionActions.scss";

const SelectionActions = () => {
  // return null;
  return (
    <div className="selection-actions">
      <IconButton className="selection-actions__close">
        <Close />
      </IconButton>
      <div className="selection-actions__title">
        <Typography variant="h5">2 selected</Typography>
      </div>
      <div className="selection-actions__actions">
        <MasonryActions id="123" />
      </div>
    </div>
  );
};

export default SelectionActions;
