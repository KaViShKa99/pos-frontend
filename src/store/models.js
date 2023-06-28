import { action, thunk } from "easy-peasy";
import { sendRequest, sendGetRequest } from "../services/api";

export default {
    manageInvoiceTableDataUpdateID: {},
    stcokTableData: {},
    manageVehiclesTableData: {},
    ProductDetailsTableData: {},
    vehicleProductDetailsTableData: {},
    selectedManageInvoice: {},
    manageInvoiceTableData: {},
    productList: [],
    createdBillInoiceIdList: {},
    createdVehicleNumberList: {},
    alreadyAddedProducts: [],
    invoiceEditSelectedProduct: [],



    setManageInvoiceTableDataUpdateID: action((state, idData) => {
        state.manageInvoiceTableDataUpdateID = {
            invoiceId: idData.invoiceId,
            rowId: idData.rowId,
        };
    }),

    setStockTableData: action((state, data) => {
        state.stcokTableData = {
            tabaleData: data,
        };
    }),

    getStockTableData: thunk(async(actions) => {
        const res = await sendGetRequest("/stocks");
        const data = await res.json();
        actions.setStockTableData(data);
    }),

    deleteStockTableData: thunk(async(actions, productId) => {
        let response;
        if (productId != 0) {
            try {
                response = await sendRequest(`/stocks/${productId}`, "DELETE", {
                    productId: productId,
                });
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                // actions.setMessage(error.message)

                return error;
            }
        }
        return response;
    }),

    addStockTableData: thunk(async(actions, addData) => {
        try {
            let response = await sendRequest("/stocks", "POST", addData);

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            // return JSON.parse(responseText).message;
            return JSON.parse(responseText);
        } catch (error) {
            alert(error.message);

            return;
        }
    }),

    updateStockTableData: thunk(async(actions, updateData) => {
        try {
            let response = await sendRequest(
                `/stocks/${updateData.productId}`,
                "PUT",
                updateData
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return;
        } catch (error) {
            alert(error.message);

            return;
        }
    }),

    setManageInvoiceTableData: action((state, data) => {
        state.manageInvoiceTableData = {
            tabaleData: data,
        };
    }),

    getManageInvoiceTableData: thunk(async(actions) => {
        const res = await sendGetRequest("/bills");
        const data = await res.json();
        actions.setManageInvoiceTableData(data);
    }),

    addManageInvoiceTableData: thunk(async(actions, addData) => {
        try {
            let response = await sendRequest("/bills", "POST", addData);

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            } else {
                let responseData = JSON.parse(responseText); // Parse the response data if it is in JSON format
                return responseData;
            }
        } catch (error) {
            alert(error.message);

            return null;
        }
    }),

    deleteManageInvoiceTableData: thunk(async(actions, productId) => {
        let response;
        if (productId != 0) {
            try {
                response = await sendRequest(`/bills/${productId}`, "DELETE", {
                    productId: productId,
                });
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                // actions.setMessage(error.message)

                return error;
            }
        }
        return response;
    }),

    updateManageInvoiceTableData: thunk(async(actions, updateData) => {
        try {
            let response = await sendRequest(
                `/bills/${updateData.invoiceId}`,
                "PUT",
                updateData
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            } else {
                let responseData = JSON.parse(responseText); // Parse the response data if it is in JSON format
                return responseData;
            }

            return;
        } catch (error) {
            alert(error.message);

            return null;
        }
    }),

    setProductNameList: action((state, data) => {
        state.productList = data;
    }),

    getProductNameList: thunk(async(actions) => {
        const res = await sendGetRequest("/stocks/product-names");
        const data = await res.json();
        actions.setProductNameList(data);
    }),

    addProductDetailsTableData: thunk(async(actions, addData) => {
        try {
            let response = await sendRequest("/bill-items", "POST", addData);

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return JSON.parse(responseText);
        } catch (error) {
            alert(error.message);

            return;
        }
    }),

    setProductDetailsTableData: action((state, data) => {
        state.ProductDetailsTableData = {
            tabaleData: data,
        };
    }),

    getProductDetailsTableData: thunk(async(actions, id) => {
        const res = await sendGetRequest(`/bill-items/${id}`);
        const data = await res.json();
        actions.setProductDetailsTableData(data);
    }),

    setCreatedBillInoiceIdList: action((state, data) => {
        state.createdBillInoiceIdList = data;
    }),

    getCreatedBillInoiceIdList: thunk(async(actions) => {
        const res = await sendGetRequest("/bill-invoice-id-list");
        const data = await res.json();
        actions.setCreatedBillInoiceIdList(data);
    }),
    addStockOutDetails: thunk(async(actions, addData) => {
        try {
            let response = await sendRequest("/stock-out", "POST", addData);

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return JSON.parse(responseText).message;
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    deleteStockOutDetails: thunk(async(actions, productId) => {
        let response;
        if (productId != 0) {
            try {
                response = await sendRequest(`/stock-out/${productId}`, "DELETE", {
                    productId: productId,
                });
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                // actions.setMessage(error.message)

                return error;
            }
        }
        return response;
    }),
    addStockOutProductQuantity: thunk(async(actions, updateData) => {
        try {
            let response = await sendRequest(
                `/stock-out/add/${updateData.product_id}`,
                "PUT",
                updateData
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return;
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    reduceStockOutProductQuantity: thunk(async(actions, updateData) => {
        try {
            let response = await sendRequest(
                `/stock-out/reduce/${updateData.product_id}`,
                "PUT",
                updateData
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return;
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    deleteProductDetailsTableData: thunk(async(actions, productId) => {
        let response;
        if (productId != 0) {
            try {
                response = await sendRequest(`/bill-items/${productId}`, "DELETE", {
                    productId: productId,
                });
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                // actions.setMessage(error.message)

                return error;
            }
        }
        return response;
    }),
    getManageInvoiceTableSelectedData: thunk(async(actions, id) => {
        const res = await sendGetRequest(`/bills/${id}`);
        const data = await res.json();
        actions.setManageInvoiceTableSelectedData(data);
    }),
    setManageInvoiceTableSelectedData: action((state, data) => {
        state.selectedManageInvoice = {
            invoice: data,
        };
    }),
    updateProductDetailsTableData: thunk(async(actions, updateData) => {
        try {
            let response = await sendRequest(
                `/bill-items/${updateData.product_details_id}`,
                "PUT",
                updateData
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return JSON.parse(responseText);
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    setAlreadyAddedProducts: action((state, data) => {
        state.alreadyAddedProducts = data;
    }),
    setInvoiceEditSelectedProduct: action((state, data) => {
        state.invoiceEditSelectedProduct = data;
    }),
    getSearchProductDetails: thunk(async(actions, id) => {
        const res = await sendGetRequest(`/stocks/${id}`);
        const data = await res.json();
        return data;
    }),
    getSearchStockOutProductDetails: thunk(async(actions, id) => {
        const res = await sendGetRequest(`/stock-out/${id}`);
        const data = await res.json();
        return data;
    }),
    addManageVehicleTableData: thunk(async(actions, addData) => {
        try {
            let response = await sendRequest("/vehicle-details", "POST", addData);

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            // return JSON.parse(responseText).message;
            return JSON.parse(responseText);
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    setManageVehiclesTableData: action((state, data) => {
        state.manageVehiclesTableData = {
            tabaleData: data,
        };
    }),
    getManageVehiclesTableData: thunk(async(actions) => {
        const res = await sendGetRequest("/vehicle-details");
        const data = await res.json();
        actions.setManageVehiclesTableData(data);
    }),
    deleteManageVehiclesTableData: thunk(async(actions, productId) => {
        let response;
        if (productId != 0) {
            try {
                response = await sendRequest(
                    `/vehicle-details/${productId}`,
                    "DELETE", {
                        productId: productId,
                    }
                );
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                // actions.setMessage(error.message)

                return error;
            }
        }
        return response;
    }),
    addVehicleProductDetailsTableData: thunk(async(actions, addData) => {
        try {
            let response = await sendRequest(
                "/vehicle-product-details",
                "POST",
                addData
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return JSON.parse(responseText);
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    deleteVehicleProductDetailsTableData: thunk(async(actions, productId) => {
        let response;
        if (productId != 0) {
            try {
                response = await sendRequest(
                    `/vehicle-product-details/${productId}`,
                    "DELETE", {
                        productId: productId,
                    }
                );
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                // actions.setMessage(error.message)

                return error;
            }
        }
        return response;
    }),
    setVehicleProductDetailsTableData: action((state, data) => {
        state.vehicleProductDetailsTableData = {
            tabaleData: data,
        };
    }),
    getVehicleProductDetailsTableData: thunk(async(actions, id) => {
        const res = await sendGetRequest(`/vehicle-product-details/${id}`);
        const data = await res.json();
        actions.setVehicleProductDetailsTableData(data);
    }),
    setCreatedVehicleNumberList: action((state, data) => {
        state.createdVehicleNumberList = data;
    }),

    getCreatedVehicleNumberList: thunk(async(actions) => {
        const res = await sendGetRequest("/vehicle-number-list");
        const data = await res.json();
        actions.setCreatedVehicleNumberList(data);
    }),
    addVehicleItem: thunk(async(actions, vehicleNumber) => {
        try {
            let response = await sendRequest(
                `/vehicle-details/add/${vehicleNumber}`,
                "PUT", { vehicleNumber }
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return;
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    reduceVehicleItem: thunk(async(actions, vehicleNumber) => {
        try {
            let response = await sendRequest(
                `/vehicle-details/reduce/${vehicleNumber}`,
                "PUT", { vehicleNumber }
            );

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            return;
        } catch (error) {
            alert(error.message);

            return;
        }
    }),
    getSelectedProductDetails: thunk(async(actions, id) => {

        try {
            let response = await sendGetRequest(`/stocks/${id}`);

            let responseText = await response.text();
            if (!response.ok) {
                let gg = JSON.parse(responseText).message;
                throw new Error(gg);
            }

            // return JSON.parse(responseText).message;
            return JSON.parse(responseText);
        } catch (error) {
            alert(error.message);

            return;
        }
    })

};