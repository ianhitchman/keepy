import Modal from "../Modal";
import { useFetchTasks } from "../../../hooks/useFetchTasks";
import { Input } from "@mui/material";
import ImagesPreview from "../ImagesPreview";
import MasonryActions from "../Masonry/MasonryActions";
import "./CardEditModal.scss";

interface CardEditModalProps {
  itemId: string | undefined | null;
  onClose: () => void;
}

const CardEditModal: React.FC<CardEditModalProps> = ({
  itemId = null,
  onClose,
}) => {
  const { data: tasks } = useFetchTasks();
  if (!itemId) return null;
  const task = tasks?.find((task) => task.id === itemId);
  if (!task) return null;

  const imagePath = `http://localhost:8090/api/files/tasks/${task?.id}/`;
  const hasImages = !!(task.images && task.images.length > 0);

  return (
    <Modal open={!!itemId} onClose={onClose}>
      <div className="card-edit">
        <div className="card-edit__title">
          <Input
            defaultValue={task?.title}
            placeholder="Title"
            size="medium"
            fullWidth
            disableUnderline
            sx={{
              fontSize: "1.5rem",
            }}
          />
        </div>
        <div className="card-edit__content">
          <Input
            defaultValue={task?.content}
            placeholder="Content"
            size="small"
            fullWidth
            multiline
            disableUnderline
          />
          {hasImages && (
            <div className="masonry-container__card__content__image">
              <ImagesPreview path={imagePath} images={task.images || null} />
            </div>
          )}
        </div>
        <div className="card-edit__actions">
          <MasonryActions id={task?.id} />
        </div>
      </div>
    </Modal>
  );
};

export default CardEditModal;
