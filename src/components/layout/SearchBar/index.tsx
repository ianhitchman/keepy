import { TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import "./SearchBar.scss";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <TextField
        placeholder="Search"
        variant="filled"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          ),
          onBlur: () => {
            console.log("hide search");
          },
        }}
        fullWidth
        sx={{
          width: "min(100%, 615px)",
          "& .MuiInputBase-root": {
            borderRadius: "0.5rem",
          },
          "& .MuiFilledInput-input": {
            padding: "0.75rem",
          },
          "& .MuiInputAdornment-root": {
            marginTop: "0 !important",
          },
        }}
      />
    </div>
  );
};

export default SearchBar;
