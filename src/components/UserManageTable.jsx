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
import { Delete, Edit, Add } from "@mui/icons-material";
import { useStoreState, useStoreActions } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const VehicleManageTable = () => {
  const manageUserTableData = useStoreState(
    (state) => state.manageUserTableData
  );

  const getUserTableData = useStoreActions(
    (actions) => actions.getUserTableData
  );
  const deleteUserTableData = useStoreActions(
    (actions) => actions.deleteUserTableData
  );
  const addUserTableData = useStoreActions(
    (actions) => actions.addUserTableData
  );
  const updateUserTableData = useStoreActions(
    (actions) => actions.updateUserTableData
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
  const createdVehicleNumberList = useStoreState(
    (state) => state.createdVehicleNumberList
  );

  const getCreatedVehicleNumberList = useStoreActions(
    (state) => state.getCreatedVehicleNumberList
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [tableData, setTableData] = useState([]);
  const [createdVehicleNumbers, setCreatedVehicleNumbers] = useState([]);

  useEffect(() => {
    getUserTableData();
    getCreatedVehicleNumberList();
  }, []);

  useEffect(() => {
    if (createdVehicleNumberList) {
      const vehicleNumbers = Object.values(createdVehicleNumberList).map(
        (data) => data.vehicle_number
      );
      setCreatedVehicleNumbers(vehicleNumbers);
    }
  }, [createdVehicleNumberList]);

  useEffect(() => {
    if (manageUserTableData.tabaleData) {
      setTableData(manageUserTableData.tabaleData);
    }
  }, [manageUserTableData.tabaleData]);

  useEffect(() => {
    getProductNameList();
  }, [tableData]);

  const handleCreateNewRow = async (values) => {
    const { message, data, status } = await addUserTableData(values);

    if (status === "success") {
      toast.success(message, { autoClose: 1500 });
      setTableData([...tableData, data]);
    } else if((status === "error")) {
      toast.error(message, { autoClose: 1500 });
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;

      updateUserTableData(values);
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
        !confirm(
          `Are you sure you want to delete user ${row.original.user_name}`
        )
      ) {
        return;
      }
      deleteUserTableData(row.original.user_id);
      // console.log("🚀 ~ file: UserManageTable.jsx:116 ~ VehicleManageTable ~ row.original.user_id:", row.original.user_id)

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
        accessorKey: "user_id",
        header: "User Id",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
        // hidden: true,
      },
      {
        accessorKey: "user_name",
        header: "User Name",
        enableColumnOrdering: false,
        enableEditing: true,
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "password",
        header: "password",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
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
          columnVisibility: { user_id: false },
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
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>

              {/* {!createdVehicleNumbers.includes(row.original.vehicle_number) ? (
                <Button
                  style={{ fontSize: "12px" }}
                  component={Link}
                  to={`/vehicle-products/${row.original.vehicle_number}`}
                  startIcon={<Add />}
                >
                  Add Products
                </Button>
              ) : (
                <Button
                  style={{ fontSize: "12px" ,color:"green"}}
                  component={Link}
                  to={`/vehicle-products/${row.original.vehicle_number}`}
                  // startIcon={<Show />}
                >
                  Show Products
                </Button>
               )}  */}
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Add User
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
      <DialogTitle textAlign="center">Add User</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
            style={{ marginTop: "10px" }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "user_id") {
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
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add User
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

export default VehicleManageTable;
