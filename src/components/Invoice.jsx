import "../styles/invoice.css";
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
// import { Button, MenuItem } from "@mui/material";
// import DialogBox from "../components/DialogBox";
import AddBillDetailsDialogBox from "./AddBillDetailsDialogBox";
import UpdateProductDetails from "../components/UpdateProductDetails";
import BillPDF from "../components/BillPdf";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useParams } from "react-router-dom";
// import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";

const Invoice = () => {
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

  const addProductDetailsTableData = useStoreActions(
    (state) => state.addProductDetailsTableData
  );
  const getSelectedProductDetails = useStoreActions(
    (state) => state.getSelectedProductDetails
  );
  const getProductDetailsTableData = useStoreActions(
    (state) => state.getProductDetailsTableData
  );
  const addStockOutProductQuantity = useStoreActions(
    (state) => state.addStockOutProductQuantity
  );
  const reduceStockOutProductQuantity = useStoreActions(
    (state) => state.reduceStockOutProductQuantity
  );
  const deleteProductDetailsTableData = useStoreActions(
    (state) => state.deleteProductDetailsTableData
  );
  const ProductDetailsTableData = useStoreState(
    (state) => state.ProductDetailsTableData
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

  useEffect(() => {
    getProductDetailsTableData(id);
    getManageInvoiceTableSelectedData(id);
  }, []);

  useEffect(() => {
    if (ProductDetailsTableData.tabaleData) {
      setTableData(ProductDetailsTableData.tabaleData);
    }
  }, [ProductDetailsTableData.tabaleData]);
  useEffect(() => {
    if (selectedManageInvoice.invoice) {
      setInvoiceDetails(selectedManageInvoice.invoice);
    }
  }, [selectedManageInvoice.invoice]);

  useEffect(() => {
    const productNames = tableData.map((product) => product.product_name);
    setAlreadyAddedProducts(productNames);
  }, [tableData]);

  const openUpdateView = (product, i) => {
    setInvoiceEditSelectedProduct(product);
    setSelectedProductDetailsRow({
      productDetailsId: product.product_details_id,
      rowId: i,
    });
    setUpdateModalOpen(true);
  };

  const handleSaveUpdateRowValues = async (values) => {
    if (values.discount <= 100 && values.discount >= 0) {
      const subtotal = values.unit_price * values.quantity;
      const total = subtotal - subtotal * (values.discount / 100);
      const newData = {
        product_details_id: selectedProductDetailsRow.productDetailsId,
        total: total,
        subtotal: subtotal,
        ...values,
      };

      const oldQuantity = tableData[selectedProductDetailsRow.rowId].quantity;
      const newQuantity = newData.quantity;

      const productDetails = await getSelectedProductDetails(values.product_id);

      if (productDetails.quantity >= values.quantity) {
        if (oldQuantity < newQuantity) {
          addStockOutProductQuantity({
            ...newData,
            quantity: newQuantity - oldQuantity,
          });
        } else if (oldQuantity > newQuantity) {
          reduceStockOutProductQuantity({
            ...newData,
            quantity: oldQuantity - newQuantity,
          });
        }
      }

      const { message, status } = await updateProductDetailsTableData(newData);

      if (status === "success") {
        toast.success(message, { autoClose: 1500 });
        tableData[selectedProductDetailsRow.rowId] = newData;
        setTableData([...tableData]);
      } else {
        toast.error(message, { autoClose: 2500 });
        setTableData([...tableData]);
      }

      // tableData[selectedProductDetailsRow.rowId] = newData;

      // setTableData([...tableData]);
    } else {
      toast.error("Discount should be less than 100%", { autoClose: 1500 });
    }
  };

  const handleCreateNewRow = async (values) => {
    if (values.discount <= 100 && values.discount >= 0) {
      const subtotal = values.unit_price * values.quantity;
      const total = subtotal - subtotal * (values.discount / 100);

      const newData = {
        invoice_id: id,
        total: total,
        subtotal: subtotal,
        ...values,
      };

      await addStockOutProductQuantity(newData);
      const { message, data, status } = await addProductDetailsTableData(
        newData
      );
      if (status === "success") {
        toast.success(message, { autoClose: 1500 });
        setTableData([...tableData, data]);
      } else {
        toast.error(message, { autoClose: 2500 });
        setTableData([...tableData]);
      }
      // setTableData([...tableData, data]);
    } else {
      toast.error("Discount should be less than 100%", { autoClose: 1500 });
    }
  };

  const handleDeleteRow = (id, rowId, values) => {
    deleteProductDetailsTableData(id);
    reduceStockOutProductQuantity(values);

    tableData.splice(rowId, 1);
    setTableData([...tableData]);
  };
  const generateBillPDF = async () => {
    const billName = "bill.pdf";
    const blob = await pdf(
      <BillPDF
        tableData={tableData}
        overallTotal={overallTotal}
        currentTime={currentTime}
        invoiceDetails={invoiceDetails}
      />
    ).toBlob();
    saveAs(blob, billName);
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
        <p className="bill-table-title">INVOICE</p>
        <div className="btns">
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            style={{ marginRight: "10px" }}
          >
            Add PRODUCT
          </Button>
          <Button
            color="secondary"
            onClick={generateBillPDF}
            variant="contained"
          >
            Generate bill
          </Button>
        </div>

        <div className="container">
          <div className="bill-header">
            <div className="bill-header-left">
              <h1>{invoiceDetails.display_id} </h1>
              <p>{invoiceDetails.customer_name}</p>
              <br />
              <h1>Company Name</h1>
              <p>Address, City, State, Zip</p>
              <p>Phone: 123-456-7890</p>
            </div>
            <div className="bill-header-right">
              <h2>POS System Bill</h2>
              <p>Date: {currentTime.toLocaleDateString()}</p>
              <p>Time: {currentTime.toLocaleTimeString()}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Sub Total</th>
                <th>Discount (%)</th>
                <th>Total</th>
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
                    <td>{product.quantity}</td>
                    <td>{product.unit_price}</td>
                    <td>{subtotal}</td>
                    <td>{product.discount} %</td>
                    <td>{total.toFixed(2)}</td>
                    <td>
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteRow(
                            product.product_details_id,
                            i,
                            product
                          )
                        }
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        color="edit"
                        onClick={() => openUpdateView(product, i)}
                      >
                        <Edit />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="5">Total:</td>
                <td>Rs: {overallTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="bill-total">
            <p>Amount Due: Rs {overallTotal.toFixed(2)}</p>
          </div>

          <div className="bill-footer">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </div>
      <AddBillDetailsDialogBox
        columns={inputField}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      <UpdateProductDetails
        columns={inputField}
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSubmit={handleSaveUpdateRowValues}
      />
    </div>
  );
};

export default Invoice;
