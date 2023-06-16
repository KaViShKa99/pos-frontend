import { useTranslation } from "react-i18next";
import Table from "../components/StockTable";
import "../styles/home.css";
import Nav from "../components/NavBar";

const Home = () => {
  
  const { t } = useTranslation();
  return (
    <div className="main-container">
      {/* <p className=""> {t("add")}  </p> */}
      <div className="nav-bar">
        <Nav />
      </div>

      <div className="stock-details">
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
      </div>

      <div className="stock-table">
        <p className="products-table-title">Products</p>
        <Table />
      </div>
    </div>
  );
};

export default Home;
