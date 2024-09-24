import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import {
  LightbulbOutlined,
  ChecklistOutlined,
  ImageOutlined,
  // BrushOutlined,
} from "@mui/icons-material";

import "./CreateNew.scss";

const CreateNew = () => {
  return (
    <div className="create-new">
      <SpeedDial
        ariaLabel="Navigation speed dial"
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      >
        <SpeedDialAction icon={<LightbulbOutlined />} tooltipTitle="Note" />
        <SpeedDialAction icon={<ChecklistOutlined />} tooltipTitle="List" />
        <SpeedDialAction icon={<ImageOutlined />} tooltipTitle="Image" />
        {/* <SpeedDialAction icon={<BrushOutlined />} tooltipTitle="Drawing" /> */}
      </SpeedDial>
    </div>
  );
};

export default CreateNew;
