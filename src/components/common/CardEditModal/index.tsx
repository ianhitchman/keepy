import { useState, useEffect, useRef } from "react";
import Modal from "../Modal";
import { useFetchTasks } from "../../../hooks/useFetchTasks";
import { Input, Button } from "@mui/material";
import { Check } from "@mui/icons-material";
import ImagesPreview from "../ImagesPreview";
import MasonryActions from "../Masonry/MasonryActions";
import "./CardEditModal.scss";
import useStore from "../../../hooks/useStore";
import useParseIncomingTasks from "../../../hooks/useParseIncomingTasks";
import { useUpdateTask } from "../../../hooks/useFetchTasks";
import { Card } from "../../../types/Card";

const CardEditModal = () => {
  const editModalId = useStore((state) => state.editModalId);
  const setEditModalId = useStore((state) => state.setEditModalId);
  const modalData = useStore((state) => state.modalData);
  const setModalData = useStore((state) => state.setModalData);
  const [workingData, setWorkingData] = useState<Card | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tasks } = useFetchTasks();
  const { mutate: updateTask } = useUpdateTask();
  const findTaskData = tasks?.find((task) => task.id === editModalId);
  const task = useParseIncomingTasks(
    findTaskData ? [findTaskData] : null,
    [editModalId],
    false
  )[0];

  useEffect(() => {
    if (modalData) return setWorkingData(modalData);
    if (task) return setWorkingData(task);
  }, [modalData, task]);

  useEffect(() => {
    if (editModalId) {
      const taskData = task || workingData;
      if (taskData) {
        setWorkingData({ ...taskData, id: editModalId });
      }
    }
  }, [editModalId]);

  const handleInputChange =
    (field: keyof Card) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setWorkingData((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: event.target.value };
      });
    };

  const handleClose = () => {
    setEditModalId(null);
    setModalData(null);
    setWorkingData(null);
  };

  const handleSave = () => {
    if (editModalId) {
      const submitData = {
        title: workingData?.title,
        content: workingData?.content,
      };
      updateTask({ id: editModalId, body: submitData });
    }
    handleClose();
  };

  const imagePath = `http://localhost:8090/api/files/tasks/${workingData?.id}/`;
  const hasImages = !!(workingData?.images && workingData?.images.length > 0);

  return (
    <Modal
      open={!!workingData?.id}
      focusRef={inputRef}
      disableAutoFocus
      onClose={handleClose}
    >
      <div className="card-edit">
        <div className="card-edit__title">
          <Input
            defaultValue={workingData?.title}
            placeholder="Title"
            size="medium"
            fullWidth
            disableUnderline
            inputRef={inputRef}
            sx={{
              fontSize: "1.5rem",
            }}
            onChange={handleInputChange("title")}
          />
        </div>
        <div className="card-edit__content">
          <Input
            defaultValue={workingData?.content}
            placeholder="Content"
            size="small"
            fullWidth
            multiline
            disableUnderline
            onChange={handleInputChange("content")}
          />
          {hasImages && (
            <div className="masonry-container__card__content__image">
              <ImagesPreview
                path={imagePath}
                images={workingData?.images || null}
              />
            </div>
          )}
        </div>
        <div className="card-edit__footer">
          <div className="card-edit__actions">
            <MasonryActions id={workingData?.id} />
          </div>
          <Button
            variant="contained"
            disabled={!!!editModalId}
            startIcon={<Check />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CardEditModal;
