import { Document, Page, View, Text } from "@react-pdf/renderer";

const Bill = ({tableData,overallTotal,currentTime}) => {
    const styles = {
        billContainer: {
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", 
          backgroundColor: "#f2f2f2",
        },
        billHeader: {
          flexDirection: "row",
          marginBottom: 20,
          width: "100%", 
          backgroundColor: "#ffffff", 
          padding: 10, 
        },
        billHeaderLeft: {
          flex: 1,
        },
        billHeaderRight: {
          flex: 1,
          textAlign: "right",
        },
        companyName: {
          fontSize: 20,
          fontWeight: "bold",
        },
        billTitle: {
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 10,
        },
        billTable: {
          marginBottom: 20,
          width: "100%", // Adjust the width to 100%
          backgroundColor: "#ffffff", // Set a background color
          padding: 10, // Add padding
        },
        tableHeader: {
          flexDirection: "row",
          backgroundColor: "#f2f2f2",
          padding: 5,
          marginBottom: 5,
        },
        tableHeaderCell: {
          flex: 1,
          fontWeight: "bold",
          textAlign: "center",
        },
        tableBody: {
          flexDirection: "column",
        },
        tableRow: {
          flexDirection: "row",
          marginBottom: 5,
        },
        tableCell: {
          flex: 1,
          textAlign: "center",
        },
        tableFooter: {
          flexDirection: "row",
          marginTop: 10,
        },
        totalLabel: {
          flex: 5,
          fontWeight: "bold",
          textAlign: "right",
        },
        totalValue: {
          flex: 1,
          fontWeight: "bold",
          textAlign: "center",
        },
        billTotal: {
          marginTop: 20,
          textAlign: "right",
        },
        billFooter: {
          marginTop: 20,
          textAlign: "center",
        },
      };
    return (
      <Document>
        <Page>
          <View style={styles.billContainer}>
            <View style={styles.billHeader}>
              <View style={styles.billHeaderLeft}>
                <Text style={styles.companyName}>Company Name</Text>
                <Text>Address, City, State, Zip</Text>
                <Text>Phone: 123-456-7890</Text>
              </View>
              <View style={styles.billHeaderRight}>
                <Text style={styles.billTitle}>POS System Bill</Text>
                <Text>Date: {currentTime.toLocaleDateString()}</Text>
                <Text>Time: {currentTime.toLocaleTimeString()}</Text>
              </View>
            </View>
            <View style={styles.billTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Product</Text>
                <Text style={styles.tableHeaderCell}>Quantity</Text>
                <Text style={styles.tableHeaderCell}>Price</Text>
                <Text style={styles.tableHeaderCell}>Sub Total</Text>
                <Text style={styles.tableHeaderCell}>Discount</Text>
                <Text style={styles.tableHeaderCell}>Total</Text>
              </View>
              <View style={styles.tableBody}>
                {tableData.map((product, i) => {
                  const subtotal = product.unit_price * product.quantity;
                  const total = subtotal - subtotal * product.discount;
                  overallTotal += total;
                  return (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{product.product_name}</Text>
                      <Text style={styles.tableCell}>{product.quantity}</Text>
                      <Text style={styles.tableCell}>{product.unit_price}</Text>
                      <Text style={styles.tableCell}>{subtotal}</Text>
                      <Text style={styles.tableCell}>{product.discount}</Text>
                      <Text style={styles.tableCell}>{total}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.tableFooter}>
                <Text style={styles.totalLabel} colSpan={5}>Total:</Text>
                <Text style={styles.totalValue}>Rs: {overallTotal}</Text>
              </View>
            </View>
            <View style={styles.billTotal}>
              <Text>Amount Due: Rs {overallTotal}</Text>
            </View>
            <View style={styles.billFooter}>
              <Text>Thank you for your purchase!</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  export default Bill;