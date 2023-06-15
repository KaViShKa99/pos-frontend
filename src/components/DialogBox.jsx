import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

const DialogBox = ({ open, columns, onClose, onSubmit, title }) => {

  const [values, setValues] = useState({});
  
  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column, i) => (
              <TextField
                key={i}
                label={column.header}
                name={column.accessor}
                onChange={handleInputChange}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DialogBox;
