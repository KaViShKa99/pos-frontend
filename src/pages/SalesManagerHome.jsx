import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import Table from "../components/BillTable";
import "../styles/home.css";
import Nav from "../components/NavBar";
import DialogBox from "../components/DialogBox";

import { useCallback, useMemo, useState } from "react";
import { data, states } from "../components/makeData"

const SalesManagerHome = () => {
  const columns = useMemo(() => [
    
    //   {
    //     accessor: "customer_name",
    //     header: "Customer Name",
    //     enableColumnOrdering: false,
    //     enableEditing: false,
    //     enableSorting: false,
    //     size: 160,
    //   },
    //   {
    //     accessor: "product_id",
    //     header: "Product ID",
    //     enableColumnOrdering: false,
    //     enableEditing: false,
    //     enableSorting: false,
    //     size: 100,
    //   },
      {
        accessor: "product_name",
        header: "Product Name",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 200,
      },
      {
        accessor: "quantity",
        header: "Quantity",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
      },
      {
        accessor: "unit_price",
        header: "Unit Price",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 100,
      },
      {
        accessor: "subtotal",
        header: "Subtotal",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 100,
      },
      {
        accessor: "discount",
        header: "Discount",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 100,
      },
      {
        accessor: "total",
        header: "Total",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 100,
      },
    //   {
    //     accessor: "payment_method",
    //     header: "Payment Method",
    //     enableColumnOrdering: false,
    //     enableEditing: false,
    //     enableSorting: false,
    //     size: 160,
    //   },
  ]);
  const [tableData, setTableData] = useState(() => data);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const { t } = useTranslation();

  return (
    <div className="main-container">
      {/* <p className=""> {t("add")}</p> */}
      <div className="nav-bar">
        <Nav />
      </div>

      {/* <div className="stock-details">
        <div className="in-stock-container">
          <div className="in-stock-title">
            <span className="title">In Stock</span>
          </div>
          <div className="in-stock-value">
            <span className="value">60</span>
          </div>
        </div>
        <div className="stock-out-container">
          <div className="stock-out-title">
            <span className="title">Stock Out</span>
          </div>
          <div className="stock-out-value">
            <span className="value">02</span>
          </div>
        </div>
        <div className="total-container">
          <span className="total-title">Total</span>
          <span className="total-value">62</span>
        </div>
      </div> */}

      <div className="stock-table">
        <p className="products-table-title">MANAGE INVOICES</p>
        <Table />
        <Button
          color="secondary"
          onClick={() => setCreateModalOpen(true)}
          variant="contained"
        >
          Add Invoice
        </Button>
        <DialogBox
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
        {/* <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        /> */}
      </div>
    </div>
  );
};

export default SalesManagerHome;
