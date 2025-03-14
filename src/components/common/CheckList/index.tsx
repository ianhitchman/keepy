import { useState, useEffect, useRef } from "react";
import { FormLabel, Checkbox, Input, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { ListItem } from "../../../types/Card";
import "./CheckList.scss";

const CheckList: React.FC<{
  listItems?: ListItem[] | undefined;
  showNewList: boolean;
  onChangeList?: (list: ListItem[]) => void;
  onCreateListItem?: (data: ListItem) => Promise<ListItem>;
}> = ({ listItems, showNewList = false, onChangeList, onCreateListItem }) => {
  const [workingListItems, setWorkingListItems] = useState<
    ListItem[] | undefined
  >(listItems);
  const [showNewListItem, setShowNewListItem] = useState(showNewList);
  useEffect(() => {
    setWorkingListItems(listItems);
    setShowNewListItem(showNewList);
  }, [listItems]);

  const newListItemRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (newListItemRef.current) {
      newListItemRef.current.focus();
      newListItemRef.current.select();
    }
  }, []);

  const handleToggleCheckbox = (id: string) => {
    const newListItems = workingListItems?.map((listItem) => {
      if (listItem?.id === id) {
        return {
          ...listItem,
          isCompleted: !listItem?.isCompleted,
        };
      }
      return listItem;
    });
    setWorkingListItems(newListItems);
    if (onChangeList) {
      onChangeList(newListItems || []);
    }
  };

  const handleInsertItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    // was Enter pressed?
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();
      const newListItems = workingListItems ? [...workingListItems] : [];
      const newListItem = {
        id: "new" + Math.random(),
        label: value,
        isCompleted: false,
      };
      newListItems.push(newListItem);
      setWorkingListItems(newListItems);
      if (onChangeList) {
        onChangeList(newListItems);
      }
      input.value = "New list item";
      setTimeout(() => {
        handleUpdateInsertedItem({ ...newListItem });
        input.focus();
        input.select();
      }, 100);
    }
  };

  const handleUpdateInsertedItem = async (data: ListItem) => {
    if (onCreateListItem) {
      const oldId = data.id;
      const newListItem = await onCreateListItem(data);
      if (newListItem?.id) {
        setWorkingListItems((prev) => {
          if (!prev) return prev;
          const itemIndex = prev?.findIndex((item) => item.id === oldId);
          if (itemIndex > -1) {
            prev[itemIndex].id = newListItem?.id;
          }
          const mutatedListItems = [...prev];
          onChangeList && onChangeList(mutatedListItems);
          return mutatedListItems;
        });
      }

      return newListItem;
    }
  };

  const handleSelectInput = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      input.select();
    }, 100);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newListItems = workingListItems?.map((listItem) => {
      if (listItem?.id === e?.target?.id) {
        return {
          ...listItem,
          label: e?.target?.value,
        };
      }
      return listItem;
    });
    setWorkingListItems(newListItems);
    if (onChangeList) {
      onChangeList(newListItems || []);
    }
  };

  const handleDeleteItem = (id: string) => {
    const newListItems = workingListItems?.filter(
      (listItem) => listItem?.id !== id
    );
    if (onChangeList) {
      onChangeList(newListItems || []);
    }
    if (newListItems?.length === 0) {
      setWorkingListItems(undefined);
    } else {
      setWorkingListItems(newListItems);
    }
  };

  if (
    !showNewListItem &&
    (!workingListItems || !Array.isArray(workingListItems))
  ) {
    return null;
  }

  console.log("showNewList", showNewListItem);
  return (
    <div className="checklist">
      {workingListItems?.map((listItem) => (
        <FormLabel
          className="checklist__item"
          htmlFor={listItem?.id}
          data-is-completed={listItem?.isCompleted}
          key={listItem?.id}
        >
          <Checkbox
            className="checklist__checkbox"
            checked={listItem?.isCompleted}
            id={listItem?.id}
            onChange={() => {
              if (listItem?.id) handleToggleCheckbox(listItem?.id);
            }}
          />
          {listItem?.isCompleted ? (
            <span className="checklist__text checklist__completed">
              {listItem?.label}
            </span>
          ) : (
            <Input
              className="checklist__text"
              defaultValue={listItem?.label}
              placeholder="List item"
              size="small"
              fullWidth
              multiline
              disableUnderline
              id={listItem?.id}
              onChange={handleInputChange}
              sx={{
                "flex-grow": 1,
              }}
            />
          )}
          <IconButton
            className="checklist__delete"
            id={listItem?.id}
            onClick={() => {
              if (listItem?.id) handleDeleteItem(listItem?.id);
            }}
          >
            <Delete />
          </IconButton>
        </FormLabel>
      ))}
      <FormLabel className="checklist__item" htmlFor="listItemNew" key="new">
        <IconButton className="checklist__add">
          <Add />
        </IconButton>
        <Input
          className="checklist__text"
          defaultValue="New list item"
          placeholder="New list item"
          size="small"
          fullWidth
          id="listItemNew"
          disableUnderline
          inputRef={newListItemRef}
          sx={{
            "flex-grow": 1,
          }}
          onFocus={handleSelectInput}
          onKeyUp={handleInsertItem}
        />
      </FormLabel>
    </div>
  );
};

export default CheckList;
