import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import Table from "../components/InvoiceManageTable";
import "../styles/salesMangerHome.css";
import Nav from "../components/NavBar";
import DialogBox from "../components/AddBillDetailsDialogBox";
import { useStoreState, useStoreActions } from "easy-peasy";

import { useMemo, useState, useEffect } from "react";

const SalesManagerHome = () => {
  // const inputFields = useMemo(() => [
  //   {
  //     accessor: "customer_name",
  //     header: "Customer Name",
  //     enableColumnOrdering: false,
  //     enableEditing: false,
  //     enableSorting: false,
  //     size: 160,
  //   },
  //   {
  //     accessor: "payment_method",
  //     header: "Payment Method",
  //     enableColumnOrdering: false,
  //     enableEditing: false,
  //     enableSorting: false,
  //     size: 160,
  //   },
  // ]);
  // const [tableData, setTableData] = useState(() => data);

  // const [createModalOpen, setCreateModalOpen] = useState(false);

  // const addManageInvoiceTableData = useStoreActions(
  //   (actions) => actions.addManageInvoiceTableData
  // );

  // const handleCreateNewRow = (values) => {
  //   addManageInvoiceTableData(values);
  //   // tableData.push(values);
  //   // setTableData([...tableData]);
  // };

  const { t } = useTranslation();

  return (
    <div className="main-container">
      {/* <p className=""> {t("add")}</p> */}
      <div className="nav-bar">
        <Nav />
      </div>

      <div className="invoice-table-container">
        <p className="invoice-table-title">MANAGE INVOICES</p>
        <Table />
        <div className="add-invoice-btn">
          {/* <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Add Invoice
          </Button> */}
        </div>
        {/* <DialogBox
          columns={inputFields}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          title={"Invoice"}
        /> */}
      </div>
    </div>
  );
};

export default SalesManagerHome;
