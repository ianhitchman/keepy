import { useEffect } from "react";
import { Modal as MuiModal, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import useStore from "../../../hooks/useStore";
import "./Modal.scss";

interface ModalProps {
  open?: boolean;
  disableAutoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  focusRef?: React.RefObject<any>;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  children = null,
  disableAutoFocus = false,
  className = "",
  focusRef = null,
  onClose,
}) => {
  const modalData = useStore((state) => state.modalData);
  const classNames = className ? `${className} modal` : "modal";

  useEffect(() => {
    if (open && focusRef) {
      requestAnimationFrame(() => {
        if (focusRef.current) {
          focusRef.current.focus();
          console.log(modalData?.id);
          if (modalData?.id === "pending") {
            focusRef.current.select();
          }
        }
      });
    }
  }, [open]);

  return (
    <MuiModal
      open={!!open}
      onClose={onClose}
      disableAutoFocus={disableAutoFocus}
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
