import { IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import MasonryActions from "../Masonry/MasonryActions";
import useStore from "../../../hooks/useStore";
import "./SelectionActions.scss";

const SelectionActions = () => {
  const selectedOptionIds = useStore((state) => state.selectedOptionIds);
  const setSelectedOptionIds = useStore((state) => state.setSelectedOptionIds);
  const setSelectedOptionsShowing = useStore(
    (state) => state.setIsSelectedOptionsShowing
  );
  const handleClose = () => {
    setSelectedOptionIds(new Set());
    setSelectedOptionsShowing(false);
  };
  const itemsCount = selectedOptionIds?.size || 0;
  return (
    <div className="selection-actions">
      <IconButton className="selection-actions__close" onClick={handleClose}>
        <Close />
      </IconButton>
      <div className="selection-actions__title">
        <Typography variant="h5">{itemsCount} selected</Typography>
      </div>
      <div className="selection-actions__actions">
        <MasonryActions id="123" />
      </div>
    </div>
  );
};

export default SelectionActions;
