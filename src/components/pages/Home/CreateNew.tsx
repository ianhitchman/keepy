import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Card } from "../../../types/Card";

import {
  LightbulbOutlined,
  ChecklistOutlined,
  ImageOutlined,
  // BrushOutlined,
} from "@mui/icons-material";

import { useCreateTask } from "../../../hooks/useFetchTasks";
import useStore from "../../../hooks/useStore";

import "./CreateNew.scss";

const CreateNew = () => {
  const setEditModalId = useStore((state) => state.setEditModalId);
  const setModalData = useStore((state) => state.setModalData);

  const createCallback = (data?: any) => {
    const { id } = data?.result || {};
    if (id) {
      setEditModalId(id);
    }
  };

  const errorCallback = () => {};

  const { mutate: createTask } = useCreateTask(createCallback);

  const handleCreateTask = (type?: string) => {
    const body: Card = {
      title: "New Task",
    };
    createTask({
      body,
    });
    const editBody: Card = { ...body };
    if (type === "list") {
      editBody.showList = true;
    }
    setModalData(editBody);
  };

  return (
    <div className="create-new">
      <SpeedDial
        ariaLabel="Navigation speed dial"
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClick={() => handleCreateTask()}
      >
        <SpeedDialAction icon={<LightbulbOutlined />} tooltipTitle="Note" />
        <SpeedDialAction
          icon={<ChecklistOutlined />}
          tooltipTitle="List"
          onClick={(e) => {
            e.stopPropagation();
            handleCreateTask("list");
          }}
        />
        <SpeedDialAction icon={<ImageOutlined />} tooltipTitle="Image" />
        {/* <SpeedDialAction icon={<BrushOutlined />} tooltipTitle="Drawing" /> */}
      </SpeedDial>
    </div>
  );
};

export default CreateNew;
