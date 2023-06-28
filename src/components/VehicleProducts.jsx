// import "../styles/vehicleProducts.css";
import React, { useMemo, useState, useEffect } from "react";
import Nav from "../components/NavBar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import VehicleProductAddDialogBox from "./VehicleProductAddDialogBox";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useParams } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";

const VehicleProducts = () => {
  const { id } = useParams();
  let overallTotal = 0;

  const inputField = useMemo(() => [
    {
      accessor: "product_name",
      header: "Product Name",
    },
    {
      accessor: "quantity",
      header: "Quantity",
    },
    {
      accessor: "unit_price",
      header: "Unit Price",
    },
    {
      accessor: "discount",
      header: "Discount %",
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [selectedProductDetailsRow, setSelectedProductDetailsRow] = useState({
    productDetailsId: 0,
    rowId: 0,
  });

  const addVehicleProductDetailsTableData = useStoreActions(
    (state) => state.addVehicleProductDetailsTableData
  );
  const getVehicleProductDetailsTableData = useStoreActions(
    (state) => state.getVehicleProductDetailsTableData
  );
  const addStockOutProductQuantity = useStoreActions(
    (state) => state.addStockOutProductQuantity
  );
  const reduceStockOutProductQuantity = useStoreActions(
    (state) => state.reduceStockOutProductQuantity
  );
  const deleteVehicleProductDetailsTableData = useStoreActions(
    (state) => state.deleteVehicleProductDetailsTableData
  );
  const vehicleProductDetailsTableData = useStoreState(
    (state) => state.vehicleProductDetailsTableData
  );
  const selectedManageInvoice = useStoreState(
    (state) => state.selectedManageInvoice
  );
  const getManageInvoiceTableSelectedData = useStoreActions(
    (state) => state.getManageInvoiceTableSelectedData
  );
  const updateProductDetailsTableData = useStoreActions(
    (state) => state.updateProductDetailsTableData
  );
  const setAlreadyAddedProducts = useStoreActions(
    (state) => state.setAlreadyAddedProducts
  );
  const setInvoiceEditSelectedProduct = useStoreActions(
    (state) => state.setInvoiceEditSelectedProduct
  );
  const addVehicleItem = useStoreActions(
    (state) => state.addVehicleItem
  );
  const reduceVehicleItem = useStoreActions(
    (state) => state.reduceVehicleItem
  );

  useEffect(() => {
    getVehicleProductDetailsTableData(id);
    // getManageInvoiceTableSelectedData(id);
  }, []);

  useEffect(() => {
    if (vehicleProductDetailsTableData.tabaleData) {
      setTableData(vehicleProductDetailsTableData.tabaleData);
    }
  }, [vehicleProductDetailsTableData.tabaleData]);

  // useEffect(() => {
  //   if (selectedManageInvoice.invoice) {
  //     setInvoiceDetails(selectedManageInvoice.invoice);
  //   }
  // }, [selectedManageInvoice.invoice]);

  useEffect(() => {
    
  const productNames = tableData.map((product)=>product.product_name)
  setAlreadyAddedProducts(productNames)
  }, [tableData]);

 
  const handleCreateNewRow = async (values) => {
   

      const newData = {
        vehicleNumber: id,
        ...values,
      };

      const { message, data } = await addVehicleProductDetailsTableData(newData);
      toast.success(message, { autoClose: 1500 });
      // addStockOutProductQuantity(newData);
      addVehicleItem(id)
      setTableData([...tableData, data]);
    // } else {
    //   toast.error("Discount should be less than 100%", { autoClose: 1500 });
    // }
  };

  const handleDeleteRow = (deleteid, rowId) => {
    deleteVehicleProductDetailsTableData(deleteid);
    reduceVehicleItem(id)
    tableData.splice(rowId, 1);
    setTableData([...tableData]);
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="main-container">
      <ToastContainer />

      <div className="nav-bar">
        <Nav />
      </div>
      <div className="display-bill">
        <p className="bill-table-title">VEHICLE PRODUCTS</p>
        <div className="btns">
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            style={{ marginRight: "10px" }}
          >
            Add PRODUCT
          </Button>
          
        </div>

        <div className="container">
          <div className="bill-header">
            <div className="bill-header-left">
              <h1>Vehicle Number: {id} </h1>
              <p>{invoiceDetails.customer_name}</p>
              <p>Date: {currentTime.toLocaleDateString()}</p>
              <br />
            </div>
            <div className="bill-header-right">
              {/* <h2>POS System Bill</h2> */}
              {/* <p>Date: {currentTime.toLocaleDateString()}</p> */}
              {/* <p>Time: {currentTime.toLocaleTimeString()}</p> */}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                {/* <th>Quantity</th>
                <th>Price</th>
                <th>Sub Total</th>
                <th>Discount (%)</th>
                <th>Total</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((product, i) => {
                const subtotal = product.unit_price * product.quantity;
                const total = subtotal - subtotal * (product.discount / 100);
                overallTotal += total;
                return (
                  <tr key={i}>
                    <td>{product.product_name}</td>
                    {/* <td>{product.quantity}</td>
                    <td>{product.unit_price}</td>
                    <td>{subtotal}</td>
                    <td>{product.discount} %</td>
                    <td>{total}</td> */}
                    <td>
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteRow(product.vehicle_product_id, i)
                        }
                      >
                        <Delete />
                      </IconButton>
                      {/* <IconButton
                        color="edit"
                        onClick={() =>
                          openUpdateView(product, i)
                        }
                      >
                        <Edit />
                      </IconButton> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="total-row">
                {/* <td colSpan="5">Total:</td>
                <td>Rs: {overallTotal}</td> */}
              </tr>
            </tfoot>
          </table>

          <div className="bill-total">
            {/* <p>Amount Due: Rs {overallTotal}</p> */}
          </div>

          <div className="bill-footer">
            {/* <p>Thank you for your purchase!</p> */}
          </div>
        </div>
      </div>
      <VehicleProductAddDialogBox
        columns={inputField}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      
    </div>
  );
};

export default VehicleProducts;
