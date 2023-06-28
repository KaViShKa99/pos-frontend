import { useTranslation } from "react-i18next";
import Table from "../components/StockTable";
import VehicleManageTable from "../components/VehicleManageTable";
import "../styles/home.css";
import Nav from "../components/NavBar";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
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
import io from "socket.io-client";

const socket = io("http://127.0.0.1:3333");
const Home = () => {
  const { t } = useTranslation();
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected to WebSocket server");
    });

    socket.on("reachMinimum", (data) => {
      setNotification((prev) => {
        if (prev.includes(data)) {
          return prev;
        }
        return [...prev, data];
      });
    });

    socket.onAny((event, ...args) => {
      // console.log(`Received event: ${event}`, args);
    });
    return () => {
      socket.offAny();
    };
  }, []);

  useEffect(() => {
    if (notification.length > 0) {
      localStorage.setItem("notification", JSON.stringify(notification));
    }
  }, [notification]);

  useEffect(() => {
    const storedNotification = localStorage.getItem("notification");
    if (storedNotification) {
      setNotification(JSON.parse(storedNotification));
    }
  }, []);

  const getSearchProductDetails = useStoreActions(
    (state) => state.getSearchProductDetails
  );
  const getProductNameList = useStoreActions(
    (state) => state.getProductNameList
  );
  const getSearchStockOutProductDetails = useStoreActions(
    (state) => state.getSearchStockOutProductDetails
  );

  const productList = useStoreState((state) => state.productList);

  const [totalQuantity, setTotalQuantity] = useState("-");
  const [stockOutQuantity, setStockOutQuantity] = useState("-");
  const [inStockQuantity, setInStockQuantity] = useState("-");

  useEffect(() => {
    getProductNameList();
  }, []);

  const filteredItems = productList.map((p, i) => {
    return {
      id: i,
      name: p.product_name,
      product_id: p.product_id,
    };
  });

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };
  const handleOnSearch = (string, results) => {
    if (string === "") {
      setTotalQuantity("-");
      setStockOutQuantity("-");
      setInStockQuantity("-");
    }
  };

  const handleOnSelect = async (item) => {
    const selectedProductDetails = await getSearchProductDetails(
      item.product_id
    );
    const stockOutProduct = await getSearchStockOutProductDetails(
      item.product_id
    );

    const total = selectedProductDetails.quantity;
    const stockOut = stockOutProduct.quantity;
    const inStock = selectedProductDetails.quantity - stockOutProduct.quantity;

    setTotalQuantity(total);
    setStockOutQuantity(stockOut);
    setInStockQuantity(inStock);
  };


  return (
    <div className="main-container">
      {/* <p className=""> {t("add")}  </p> */}
      <div className="nav-bar">
        <Nav notification={notification} />
      </div>

      <div className="stock-details">
        <div className="search-bar">
          <ReactSearchAutocomplete
            items={filteredItems}
            onSearch={handleOnSearch}
            // onHover={handleOnHover}
            onSelect={handleOnSelect}
            // onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
            placeholder="search"
          />
        </div>

        <div className="in-stock-container">
          <div className="in-stock-title">
            <span className="title">In Stock</span>
            {/* <span className="title">{t("inStock")}</span> */}
          </div>
          <div className="in-stock-value">
            <span className="value">{inStockQuantity}</span>
          </div>
        </div>
        <div className="stock-out-container">
          <div className="stock-out-title">
            <span className="title">Stock Out</span>
            {/* <span className="title">{t("stockOut")}</span> */}
          </div>
          <div className="stock-out-value">
            <span className="value">{stockOutQuantity}</span>
          </div>
        </div>
        <div className="total-container">
          <span className="total-title">Total</span>
          {/* <span className="total-title">{t("total")}</span> */}
          <span className="total-value">{totalQuantity}</span>
        </div>
      </div>

      <div className="stock-table">
        <p className="products-table-title">PRODUCTS</p>
        {/* <p className="products-table-title">{t("products")}</p> */}
        <Table />
      </div>
      <div className="vehicle-manage-container">
        <p className="products-table-title">MANAGE VEHICLES</p>
        <div className="vehicle-table">
          <VehicleManageTable />
        </div>

        {/* <Multiselect
          options={filteredItems} // Options to display in the dropdown
          // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
          // onSelect={this.onSelect} // Function will trigger on select event
          // onRemove={this.onRemove} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        /> */}
      </div>
    </div>
  );
};

export default Home;
