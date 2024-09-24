import { TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import useStore from "../../../hooks/useStore";
import "./SearchBar.scss";

const SearchBar = () => {
  const searchText = useStore((state) => state.searchText);
  const setSearchText = useStore((state) => state.setSearchText);

  const handleUpdateSearchText = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value);
  };

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
          // onBlur: () => {
          //   console.log("hide search");
          // },
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
        value={searchText}
        onChange={handleUpdateSearchText}
      />
    </div>
  );
};

export default SearchBar;
