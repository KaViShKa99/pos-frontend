import "../styles/invoice1.css";
import React, { useMemo, useState, useEffect } from "react";
import Nav from "../components/NavBar";
import { Button } from "@mui/material";
// import DialogBox from "../components/DialogBox";
import DialogBox from "../components/DialogBox";
import BillPDF from "../components/BillPdf";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";

const Invoice = () => {
  let overallTotal = 0;

  const columns = useMemo(() => [
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
      header: "Discount",
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const generateBillPDF = async () => {
    const billName = "bill.pdf";
    const blob = await pdf(
      <BillPDF
        tableData={tableData}
        overallTotal={overallTotal}
        currentTime={currentTime}
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
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((product, i) => {
                const subtotal = product.unit_price * product.quantity;
                const total = subtotal - subtotal * product.discount;
                overallTotal += total;
                return (
                  <tr key={i}>
                    <td>{product.product_name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unit_price}</td>
                    <td>{subtotal}</td>
                    <td>{product.discount}</td>
                    <td>{total}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="5">Total:</td>
                <td>Rs: {overallTotal}</td>
              </tr>
            </tfoot>
          </table>

          <div className="bill-total">
            <p>Amount Due: Rs {overallTotal}</p>
          </div>

          <div className="bill-footer">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </div>
      <DialogBox
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        title={"Bill"}
      />
    </div>
  );
};
export default Invoice;
