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
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import singlishKeywords from "../languages/products.json"

const VehicleProductAddDialogBox = ({ open, columns, onClose, onSubmit }) => {
  
  const singlishProductList = Object.keys(singlishKeywords);

  const getProductNameList = useStoreActions(
    (state) => state.getProductNameList
  );
  const productList = useStoreState((state) => state.productList);
  const alreadyAddedProducts = useStoreState(
    (state) => state.alreadyAddedProducts
  );
  const [filterdProducts, setFilterdProducts] = useState([]);
  const [values, setValues] = useState({});
  const [formData, setFormData] = useState({});
  const [unitPrice, setUnitPrice] = useState("0.00");

  useEffect(() => {
    getProductNameList();
  }, []);

  useEffect(() => {}, [productList]);

  useEffect(() => {
    const notAddedProducts = productList
      .filter((product) => !alreadyAddedProducts.includes(product.product_name))
      .map((product) => product);
    setFilterdProducts(notAddedProducts);
    setFormData({});
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
      // unit_price: unitPrice,
    }));
  };

  const handleInputChange1 = (event) => {
    const { name, value } = event.target;
    const selectedProduct = filterdProducts.find(
      (product) => product.product_name === value
    );

    // setUnitPrice(selectedProduct.cost_price)
    setFormData((prevFormData) => ({
      ...prevFormData,
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
    }));
    setValues((prevValues) => ({
      ...prevValues,
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
    }));
  };

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
  ]

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Vehicle Products</DialogTitle>
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
                    {/* <InputLabel>{column.header}</InputLabel>
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
                    </Select> */}

                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={top100Films}
                      sx={{ width: 400 }}
                      renderInput={(params) => (
                        <TextField {...params} label="products" />
                      )}
                    />
                  </FormControl>
                );
              }
              if (column.accessor === "quantity") {
                return (
                  <TextField
                    key={i}
                    label={column.header}
                    name={column.accessor}
                    onChange={handleInputChange}
                  />
                );
              }
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add Products
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default VehicleProductAddDialogBox;
