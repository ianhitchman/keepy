import { useState, useEffect, useRef } from "react";
import Modal from "../Modal";
import { useFetchTasks } from "../../../hooks/useFetchTasks";
import { Input, Button, CircularProgress } from "@mui/material";
import { Check } from "@mui/icons-material";
import ImagesPreview from "../ImagesPreview";
import CheckList from "../CheckList";
import MasonryActions from "../Masonry/MasonryActions";
import "./CardEditModal.scss";
import useStore from "../../../hooks/useStore";
import useParseIncomingTasks from "../../../hooks/useParseIncomingTasks";
import { useUpdateTask } from "../../../hooks/useFetchTasks";
import {
  useFetchListItems,
  useUpdateListItem,
  useDeleteListItem,
  useCreateListItem,
} from "../../../hooks/useFetchListItems";
import { Card, ListItem } from "../../../types/Card";

const CardEditModal = () => {
  const editModalId = useStore((state) => state.editModalId);
  const setEditModalId = useStore((state) => state.setEditModalId);
  const modalData = useStore((state) => state.modalData);
  const setModalData = useStore((state) => state.setModalData);
  const [workingData, setWorkingData] = useState<Card | null>(null);
  const [originalData, setOriginalData] = useState<Card | null>(null);
  const [pendingSave, setPendingSave] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tasks } = useFetchTasks();
  const { data: listItems } = useFetchListItems();
  const { mutate: updateTask } = useUpdateTask();
  const {
    mutate: updateListItem,
    isPending: isUpdating,
    isError: isUpdateError,
  } = useUpdateListItem();
  const {
    mutate: deleteListItem,
    isPending: isDeleting,
    isError: isDeleteError,
  } = useDeleteListItem();
  const {
    mutateAsync: createListItem,
    isPending: isCreating,
    isError: isCreateError,
  } = useCreateListItem();

  const isFetching = isUpdating || isDeleting || isCreating;
  const isFetchError = isUpdateError || isDeleteError || isCreateError;

  useEffect(() => {
    if (!isFetching && pendingSave) {
      setPendingSave(false);
      if (!isFetchError) {
        return handleSave();
      }
    }
  }, [isFetching]);

  const findTaskData = tasks?.find((task) => task.id === editModalId);
  const task = useParseIncomingTasks(
    findTaskData ? [findTaskData] : null,
    [editModalId],
    false
  )[0];

  useEffect(() => {
    const dataObj = modalData || task;
    if (dataObj) {
      setOriginalData(dataObj);
      if (Array.isArray(dataObj.listItems) && dataObj.listItems.length === 0) {
        delete dataObj.listItems;
      }
      return setWorkingData(dataObj);
    }
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

  const handleChangeList = (list: ListItem[]) => {
    setWorkingData((prev) => {
      if (!prev) return prev;
      const newList = list.length === 0 ? undefined : list;
      return { ...prev, listItems: newList };
    });
  };

  const handleClose = () => {
    setEditModalId(null);
    setModalData(null);
    setWorkingData(null);
  };

  const handleCreateList = () => {
    setWorkingData((prev) => {
      if (!prev) return prev;
      const listItems = prev.listItems || [];
      return { ...prev, listItems };
    });
  };

  const handleCreateListItem = async (data: ListItem) => {
    delete data.id;
    const newListItem = (await createListItem({ body: data })) as any;
    return newListItem?.result;
  };

  const handleSave = () => {
    if (isFetching) {
      return setPendingSave(true);
    }

    if (editModalId) {
      // look for any deleted list items
      originalData?.listItems?.forEach((item) => {
        const listItem = workingData?.listItems?.find(
          (listItem) => listItem.id === item.id
        );
        if (!listItem) {
          deleteListItem({ id: item.id });
        }
      });

      const listItemIds: string[] = [];

      if (Array.isArray(workingData?.listItems)) {
        workingData?.listItems?.forEach((listItem) => {
          const checkListItem = listItems?.find(
            (item) => item.id === listItem?.id
          );
          if (checkListItem) {
            updateListItem({
              id: listItem?.id,
              body: {
                isCompleted: listItem?.isCompleted,
                label: listItem?.label,
              },
            });
            if (listItem?.id) listItemIds.push(listItem?.id);
          }
        });
      }

      const submitData = {
        title: workingData?.title,
        content: workingData?.content,
        listItems: listItemIds,
      };
      updateTask({ id: editModalId, body: submitData });
    }
    handleClose();
  };

  const imagePath = `http://localhost:8090/api/files/tasks/${workingData?.id}/`;
  const hasImages = !!(workingData?.images && workingData?.images.length > 0);
  const hasList = Array.isArray(workingData?.listItems);
  const modalClass = pendingSave ? "card-edit card-edit--saving" : "card-edit";

  return (
    <Modal
      open={!!workingData?.id}
      focusRef={inputRef}
      disableAutoFocus
      onClose={handleClose}
    >
      <div className={modalClass}>
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
          {hasList && (
            <CheckList
              listItems={workingData?.listItems}
              showNewList={!!workingData?.showList}
              onChangeList={handleChangeList}
              onCreateListItem={handleCreateListItem}
            />
          )}
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
            <MasonryActions
              id={workingData?.id}
              list={
                !!!workingData?.listItems ||
                workingData?.listItems?.length === 0
              }
              onCreateList={handleCreateList}
            />
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

      {pendingSave && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 1000,
            marginTop: "-25px",
            marginLeft: "-25px",
            color: "#fff",
          }}
          size={50}
        />
      )}
    </Modal>
  );
};

export default CardEditModal;
