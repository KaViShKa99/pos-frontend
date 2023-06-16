import { action, thunk } from 'easy-peasy'
import { sendRequest, sendGetRequest } from '../services/api';

export default {

    stcokTableData: {},
    manageInvoiceTableData: {},

    setStockTableData: action((state, data) => {
        state.stcokTableData = {
            tabaleData: data
        }
    }),


    getStockTableData: thunk(async(actions) => {
        const res = await sendGetRequest('/stocks')
        const data = await res.json();
        actions.setStockTableData(data);
    }),

    deleteStockTableData: thunk(async(actions, productId) => {
        let response
        if (productId != 0) {
            try {
                response = await sendRequest(`/stocks/${productId}`, 'DELETE', {
                    productId: productId
                })
            } catch (error) {
                console.log(error.message)
                alert(error.message)
                    // actions.setMessage(error.message)

                return error
            }
        }
        return response

    }),

    addStockTableData: thunk(async(actions, addData) => {

        try {
            let response = await sendRequest('/stocks', 'POST', addData)

            let responseText = await response.text()
            if (!response.ok) {
                let gg = JSON.parse(responseText).message
                throw new Error(gg)
            }

            return

        } catch (error) {
            alert(error.message)

            return
        }
    }),

    updateStockTableData: thunk(async(actions, updateData) => {

        try {
            let response = await sendRequest(`/stocks/${updateData.productId}`, 'PUT', updateData)

            let responseText = await response.text()
            if (!response.ok) {
                let gg = JSON.parse(responseText).message
                throw new Error(gg)
            }

            return

        } catch (error) {
            alert(error.message)

            return
        }
    }),

    setManageInvoiceTableData: action((state, data) => {
        state.manageInvoiceTableData = {
            tabaleData: data
        }
    }),

    getManageInvoiceTableData: thunk(async(actions) => {
        const res = await sendGetRequest('/bills')
        const data = await res.json();
        actions.setManageInvoiceTableData(data);
    }),

    addManageInvoiceTableData: thunk(async(actions, addData) => {

        try {
            let response = await sendRequest('/bills', 'POST', addData)

            let responseText = await response.text()
            if (!response.ok) {
                let gg = JSON.parse(responseText).message
                throw new Error(gg)
            }

            return

        } catch (error) {
            alert(error.message)

            return
        }
    }),
    deleteManageInvoiceTableData: thunk(async(actions, productId) => {
        let response
        if (productId != 0) {
            try {
                response = await sendRequest(`/bills/${productId}`, 'DELETE', {
                    productId: productId
                })
            } catch (error) {
                console.log(error.message)
                alert(error.message)
                    // actions.setMessage(error.message)

                return error
            }
        }
        return response

    }),

}