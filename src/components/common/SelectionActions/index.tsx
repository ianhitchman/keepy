import { useCallback, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import MasonryActions from "../Masonry/MasonryActions";
import useStore from "../../../hooks/useStore";
import { useUpdateTask } from "../../../hooks/useFetchTasks";
import { TagsData } from "../../../types/Card";

import "./SelectionActions.scss";

const SelectionActions = () => {
  const selectedOptionIds = useStore((state) => state.selectedOptionIds);
  const setSelectedOptionIds = useStore((state) => state.setSelectedOptionIds);
  const setSelectedOptionsShowing = useStore(
    (state) => state.setIsSelectedOptionsShowing
  );
  const tasksData = useStore((state) => state.tasksData);
  const setTasksData = useStore((state) => state.setTasksData);
  const currentPage = useStore((state) => state.currentPage);
  const [toggleArchive, setToggleArchive] = useState(
    !!!(currentPage === "archive")
  );
  const { mutate: saveTask } = useUpdateTask();

  const handleClose = () => {
    setSelectedOptionIds(new Set());
    setSelectedOptionsShowing(false);
  };

  // if all selected items are archived, clicking archive button will
  // unarchive them, and vice versa
  const isAllArchived = useCallback(() => {
    if (!selectedOptionIds) return false;
    const selectedIds = Array.from(selectedOptionIds);
    return selectedIds.every(
      (id) => tasksData.find((card) => card?.id === id)?.isArchived
    );
  }, [selectedOptionIds, tasksData]);

  if (toggleArchive === isAllArchived()) {
    setToggleArchive(!toggleArchive);
  }

  console.log("toggleArchive", toggleArchive);

  const handleUpdate = useCallback(
    (id: Array<string>, updateData: Record<string, any>) => {
      const currentData = [...tasksData];
      id.forEach((id) => {
        let itemIndex = currentData.findIndex((card) => card?.id === id);
        if (itemIndex < 0) return;

        // has isArchived been set? If so, override with value from state,
        // so that all selected cards are either archived or unarchived
        if (updateData.isArchived !== undefined) {
          updateData.isArchived = toggleArchive;
        }

        const item = { ...currentData[itemIndex], ...updateData };
        currentData[itemIndex] = item;

        // hide archived cards
        if (
          (updateData.isArchived && currentPage !== "archive") ||
          (!updateData.isArchived && currentPage === "archive")
        ) {
          currentData.splice(itemIndex, 1);
        }
        handleSave(item);
      });
      setTasksData([...currentData]);
    },
    [tasksData, currentPage]
  );

  const handleSave = (data: Record<string, any>) => {
    const saveData = { ...data };
    if (saveData?.id) {
      if (saveData?.tags) {
        saveData.tags = saveData.tags.map((tag: TagsData | string) => {
          if (typeof tag === "string") return tag;
          return tag.id;
        });
      }
      saveTask({
        id: saveData?.id,
        body: saveData,
      });
    }
  };

  const itemsCount = selectedOptionIds?.size || 0;
  return (
    <div className="selection-actions">
      <IconButton
        className="selection-actions__close"
        onClick={handleClose}
        sx={{ color: "rgba(255,255,255,0.8)" }}
      >
        <Close />
      </IconButton>
      <div className="selection-actions__title">
        <Typography variant="h5">{itemsCount} selected</Typography>
      </div>
      <div className="selection-actions__actions">
        <MasonryActions onUpdate={handleUpdate} invert multi />
      </div>
    </div>
  );
};

export default SelectionActions;
