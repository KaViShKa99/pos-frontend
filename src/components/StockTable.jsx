import React, { useCallback, useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useStoreState, useStoreActions } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";

const StockTable = () => {
  const stcokTableData = useStoreState((state) => state.stcokTableData);
  const getStockTableData = useStoreActions(
    (actions) => actions.getStockTableData
  );
  const deleteStockTableData = useStoreActions(
    (actions) => actions.deleteStockTableData
  );
  const addStockTableData = useStoreActions(
    (actions) => actions.addStockTableData
  );
  const updateStockTableData = useStoreActions(
    (actions) => actions.updateStockTableData
  );
  const addStockOutDetails = useStoreActions(
    (actions) => actions.addStockOutDetails
  );
  const deleteStockOutDetails = useStoreActions(
    (actions) => actions.deleteStockOutDetails
  );
  const getProductNameList = useStoreActions(
    (state) => state.getProductNameList
  );
  const getSearchProductDetails = useStoreActions(
    (state) => state.getSearchProductDetails
  );

  const getSearchStockOutProductDetails = useStoreActions(
    (state) => state.getSearchStockOutProductDetails
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getStockTableData();
  }, []);


  useEffect(() => {
    if (stcokTableData.tabaleData) {
      const fetchData = async () => {
        const updatedTableData = await Promise.all(
          stcokTableData.tabaleData.map(async (item) => {
            const selectedProductDetails = await getSearchProductDetails(
              item.product_id
            );
            const stockOutProduct = await getSearchStockOutProductDetails(
                item.product_id
              );
            const total = selectedProductDetails.quantity;
            const stockOut = stockOutProduct.quantity;
            const iStock = total - stockOut

            return {
              ...item,
              inStock: iStock,
            };
          })
        );
        setTableData(updatedTableData);
      };

      fetchData();
    }
  }, [stcokTableData.tabaleData]);

  useEffect(() => {
    getProductNameList();
  }, [tableData]);

  const handleCreateNewRow = async (values) => {
    const { message, data } = await addStockTableData(values);
    toast.success(message, { autoClose: 1500 });
    await addStockOutDetails({
      product_id: data.product_id,
      product_name: data.product_name,
    });
    getProductNameList();
    setTableData([...tableData, data]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;

      const updateData = {
        productId: values.product_id,
        product_name: values.product_name,
        category: values.category,
        brand: values.brand,
        supplier: values.supplier,
        cost_price: values.cost_price,
        retail_price: values.retail_price,
        quantity: values.quantity,
        maximum_stock: values.maximum_stock,
      };

      updateStockTableData(updateData);
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        (console.log(row.original.product_id),
        !confirm(
          `Are you sure you want to delete ${row.getValue("product_name")}`
        ))
      ) {
        return;
      }
      deleteStockTableData(row.original.product_id);
      deleteStockOutDetails(row.original.product_id);

      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "product_id", // New column for product ID
        header: "Product ID",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
        // hidden: true,
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        enableColumnOrdering: false,
        enableEditing: true,
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "brand",
        header: "Brand",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "supplier",
        header: "Supplier",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "email",
        }),
      },
      {
        accessorKey: "cost_price",
        header: "Cost Price",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },

      {
        accessorKey: "retail_price",
        header: "Retail Price",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },

      {
        accessorKey: "inStock",
        header: "In Stock",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "Total Quantity",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },

      {
        accessorKey: "minimum_stock",
        header: "Minimum Stock",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <ToastContainer />
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
            enableHiding: false,
          },
        }}
        enableColumnFilterModes={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableHiding={false}
        enableResetOrder={false}
        initialState={{
          columnVisibility: { product_id: false },
          density: "compact",
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Add Product
          </Button>
        )}
      />

      <CreateNewProductModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewProductModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    if (
      values.brand === "" ||
      values.category === "" ||
      values.cost_price === "" ||
      values.minimum_stock === "" ||
      values.product_name === "" ||
      values.quantity === "" ||
      values.retail_price === "" ||
      values.supplier === ""
    ) {
      toast.info("Please fill in the all fields", { autoClose: 1500 });
    } else {
      // toast.success("Please fill in all the fields",{autoClose: 1500,})
      onSubmit(values);
      onClose();
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add Product</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "product_id" || column.accessorKey === "inStock") {
                return null;
              }

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                  required
                  // ={
                  //   column.accessorKey === "cost_price" ||
                  //   column.accessorKey === "minimum_stock" ||
                  //   column.accessorKey === "product_name" ||
                  //   column.accessorKey === "quantity" ||
                  //   column.accessorKey === "retail_price" ||
                  //   column.accessorKey === "supplier"
                  // }
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default StockTable;
