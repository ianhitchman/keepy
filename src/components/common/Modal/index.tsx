import { Modal as MuiModal, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import "./Modal.scss";

interface ModalProps {
  open?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children = null,
  className = "",
  onClose,
}) => {
  const classNames = className ? `${className} modal` : "modal";
  return (
    <MuiModal
      open={!!open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={classNames}>
        <IconButton className="modal__close" onClick={onClose}>
          <Close />
        </IconButton>
        {children}
      </div>
    </MuiModal>
  );
};

export default Modal;
