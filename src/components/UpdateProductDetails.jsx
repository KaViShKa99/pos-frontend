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

const UpdateProductDetails = ({ open, columns, onClose, onSubmit }) => {
  const getProductNameList = useStoreActions(
    (state) => state.getProductNameList
  );
  const productList = useStoreState((state) => state.productList);
  const invoiceEditSelectedProduct = useStoreState(
    (state) => state.invoiceEditSelectedProduct
  );

  const [values, setValues] = useState({});
  const [formData, setFormData] = useState({});
  const [alraedyAddedDetails, setAlraedyAddedDetails] = useState({
    unitPrice: 0,
    productName: "",
  });

  useEffect(() => {
    getProductNameList();
  }, []);

  useEffect(() => {
    if(invoiceEditSelectedProduct){

      setAlraedyAddedDetails({
        product_id: invoiceEditSelectedProduct.product_id,
        unit_price: invoiceEditSelectedProduct.unit_price,
        product_name: invoiceEditSelectedProduct.product_name,
      });
     
    }
  }, [invoiceEditSelectedProduct]);

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
      ...alraedyAddedDetails,
    }));
  };

  const handleInputChange1 = (event) => {
    const { name, value } = event.target;
    const selectedProduct = productList.find(
      (product) => product.product_name === value
    );
    // setUnitPrice(selectedProduct.cost_price)
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
    }));
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Update Product Details</DialogTitle>
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
                  <TextField
                    style={{ marginTop: "10px" }}
                    key={i}
                    label={column.header}
                    name={column.accessor}
                    value={alraedyAddedDetails.product_name || ''}
                    readOnly
                    disabled
                  />
                  // <FormControl key={i} style={{ marginTop: "10px" }}>
                  //   <InputLabel>{column.header}</InputLabel>
                  //   <Select
                  //     key={i}
                  //     label={column.header}
                  //     name={column.accessor}
                  //     value={formData[column.accessor] || ""}
                  //     onChange={handleInputChange1}
                  //   >
                  //     {productList.map((product, k) => {
                  //       const { product_id, product_name } = product;
                  //       return (
                  //         <MenuItem key={product_id} value={product_name}>
                  //           {product.product_name}
                  //         </MenuItem>
                  //       );
                  //     })}
                  //   </Select>
                  // </FormControl>
                );
              }
              if (column.accessor === "unit_price") {
                return (
                  <TextField
                    key={i}
                    label={column.header}
                    name={column.accessor}
                    value={alraedyAddedDetails.unit_price || ''}
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
          Update Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default UpdateProductDetails;
