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
import moment from "moment";
import { Link } from "react-router-dom";

const InvoiceManageTable = () => {
  const manageInvoiceTableDataUpdateID = useStoreState(
    (state) => state.manageInvoiceTableDataUpdateID
  );
  const manageInvoiceTableData = useStoreState(
    (state) => state.manageInvoiceTableData
  );
  const setManageInvoiceTableDataUpdateID = useStoreActions(
    (state) => state.setManageInvoiceTableDataUpdateID
  );
  const getManageInvoiceTableData = useStoreActions(
    (actions) => actions.getManageInvoiceTableData
  );
  const addManageInvoiceTableData = useStoreActions(
    (actions) => actions.addManageInvoiceTableData
  );
  const deleteManageInvoiceTableData = useStoreActions(
    (actions) => actions.deleteManageInvoiceTableData
  );
  const updateManageInvoiceTableData = useStoreActions(
    (actions) => actions.updateManageInvoiceTableData
  );
  const getBillTotal = useStoreActions((actions) => actions.getBillTotal);
  const totalSum = useStoreState((state) => state.totalSum);

  const createdBillInoiceIdList = useStoreState(
    (state) => state.createdBillInoiceIdList
  );
  const getCreatedBillInoiceIdList = useStoreActions(
    (state) => state.getCreatedBillInoiceIdList
  );

  const [billUpdateModalOpen, setbillUpdateModalOpen] = useState(false);
  const [addBillModalOpen, setaddBillModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [createdInvoiceId, setCreatedInvoiceId] = useState([]);

  useEffect(() => {
    getManageInvoiceTableData();
    getCreatedBillInoiceIdList();
    // console.log("ss ", getBillTotal("fb9963be-bd7b-4f62-b"));
  }, []);

  useEffect(() => {
    if(createdBillInoiceIdList){
      const invoiceIds = Object.values(createdBillInoiceIdList).map((data) => data.invoice_id);
      setCreatedInvoiceId(invoiceIds);
    }
  }, [createdBillInoiceIdList]);

  useEffect(() => {
    if (manageInvoiceTableData.tabaleData) {
      
      const updatedTableData = manageInvoiceTableData.tabaleData.map((item) => {
        const createdAtFormatted = moment(item.created_at).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        //  console.log('x ',getBillTotal(item.invoice_id));
        return {
          ...item,
          created_at: createdAtFormatted,
        };
      });
      // console.log('ww ',totalSum.tabaleData);
      setTableData(updatedTableData);
    }
  }, [manageInvoiceTableData.tabaleData]);

  const handleCreateNewRow = async (values) => {
    const createdData = await addManageInvoiceTableData(values);

    const createdAtFormatted = moment(createdData.data.created_at).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const updatedTableData = {
      ...createdData.data,
      created_at: createdAtFormatted,
    };
    setTableData([...tableData, updatedTableData]);
  };

  const handleSaveUpdateRowValues = async (values) => {
    const updateData = {
      invoiceId: manageInvoiceTableDataUpdateID.invoiceId,
      customerName: values.customer_name,
      paymentMethod: values.payment_method,
    };

    const updatedData = await updateManageInvoiceTableData(updateData);
    const createdAtFormatted = moment(updatedData.data.created_at).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const updatedTableData = {
      ...updatedData.data,
      created_at: createdAtFormatted,
    };
    tableData[manageInvoiceTableDataUpdateID.rowId] = updatedTableData;
    setTableData([...tableData]);
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!confirm(`Are you sure you want to delete ${row}`)) {
        return;
      }
      deleteManageInvoiceTableData(row.original.invoice_id);
      //send api delete request here, then refetch or update local table data for re-render
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
        accessorKey: "invoice_id", // New column for product ID
        header: "Id",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
        // hidden: true,
      },
      {
        accessorKey: "display_id",
        header: "Bill Invoice",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "customer_name",
        header: "Customer Name",
        size: 80,
        
      },
      {
        accessorKey: "created_at",
        header: "Date",
        size: 80,
        enableEditing: false,
       
      },
     

      {
        accessorKey: "payment_method",
        header: "Payment Method",
        size: 80,
      
      },
      
    ],
    [getCommonEditTextFieldProps]
  );

  const updateTable = (invoiceId, rowId) => {
    const idData = {
      invoiceId: invoiceId,
      rowId: rowId,
    };
    setbillUpdateModalOpen(true);
    setManageInvoiceTableDataUpdateID(idData);
  };

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        enableColumnFilterModes={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableHiding={false}
        enableResetOrder={false}
        initialState={{
          columnVisibility: { invoice_id: false },
          density: "compact",
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        // onEditingRowSave={handleSaveRowEdits}
        // onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => updateTable(row.original.invoice_id, row.index)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="bottom" title="Navigate">
            

              {!createdInvoiceId.includes(row.original.invoice_id) ? (
                <Button
                  style={{ fontSize: "12px" }}
                  component={Link}
                  to={`/invoice/${row.original.invoice_id}`}
                  startIcon={<Add />}
                >
                  Add Bill
                </Button>
              ) : (
                <Button
                  style={{ fontSize: "12px" ,color:"green"}}
                  component={Link}
                  to={`/invoice/${row.original.invoice_id}`}
                  // startIcon={<Show />}
                >
                  Show Bill
                </Button>
              )}
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setaddBillModalOpen(true)}
            variant="contained"
          >
            Add Customer
          </Button>
        )}
      />
      <AddBillModal
        columns={columns}
        open={addBillModalOpen}
        onClose={() => setaddBillModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      <UpdateBillModal
        columns={columns}
        open={billUpdateModalOpen}
        onClose={() => setbillUpdateModalOpen(false)}
        onSubmit={handleSaveUpdateRowValues}
      />
    </>
  );
};

export const UpdateBillModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };
  const columnsToCheck = [
    "display_id",
    "created_at",
    "total",
    "bill",
    "invoice_id",
  ];

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Update Invoice</DialogTitle>
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
              if (columnsToCheck.includes(column.accessorKey)) {
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
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Update Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export const AddBillModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };
  const columnsToCheck = [
    "display_id",
    "created_at",
    "total",
    "bill",
    "invoice_id",
  ];

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add Invoice</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {/* {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))} */}

            {columns.map((column) => {
              if (columnsToCheck.includes(column.accessorKey)) {
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
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add Invoice
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

export default InvoiceManageTable;
