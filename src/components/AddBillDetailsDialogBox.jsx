import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";

const DialogBox = ({ open, columns, onClose, onSubmit }) => {
  const getProductNameList = useStoreActions(
    (state) => state.getProductNameList
  );
  const productList = useStoreState((state) => state.productList);
  const alreadyAddedProducts = useStoreState((state) => state.alreadyAddedProducts);
  const [filterdProducts,setFilterdProducts] =  useState([])
  const [values, setValues] = useState({});
  const [formData, setFormData] = useState({});
  const [unitPrice,setUnitPrice] =  useState("0.00");


  useEffect(() => {
    getProductNameList();
    
  }, []);

  useEffect(() => {
  }, [productList]);

  useEffect(() => {
    const notAddedProducts = productList.filter((product) => !alreadyAddedProducts.includes(product.product_name))
  .map((product) => product);
  setFilterdProducts(notAddedProducts)
    setFormData({})
  }, [alreadyAddedProducts]);
 

  

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
      ...formData,
      unit_price:unitPrice
    }));
  };

  const handleInputChange1 = (event) => {
    const { name, value } = event.target;
    const selectedProduct = filterdProducts.find(
      (product) => product.product_name === value
    );
    
    setUnitPrice(selectedProduct.cost_price)
    setFormData((prevFormData) => ({
      ...prevFormData,
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
    }));
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Bill</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column, i) => {
              if (column.accessor === "product_name") {
                return (
                  <FormControl key={i} style={{ marginTop: "10px" }}>
                    <InputLabel>{column.header}</InputLabel>
                    <Select
                      key={i}
                      label={column.header}
                      name={column.accessor}
                      value={formData[column.accessor] || ""}
                      onChange={handleInputChange1}
                    >
                      {filterdProducts.map((product, k) => {
                        const { product_id, product_name } = product;
                        return (
                          <MenuItem key={product_id} value={product_name}>
                            {product.product_name}
                          </MenuItem>
                        );
                      })}
                     
                    </Select>
                  </FormControl>
                );
              }
              if (column.accessor === "unit_price") {
                return (
                  <TextField
                    key={i}
                    label={column.header}
                    name={column.accessor}
                    value={unitPrice} 
                    readOnly
                    disabled
                  />
                );
              }
              return (
                <TextField
                  key={i}
                  label={column.header}
                  name={column.accessor}
                  onChange={handleInputChange}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add Bill
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DialogBox;
