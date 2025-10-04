import React from "react";
import "./style.css";

const TransactionHeader = ({ recivedTransaction, paiedTransaction }) => {
  const Sum = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      return acc + parseFloat(transaction.amount);
    }, 0);
  };

  console.log("paiedTransaction", Sum(paiedTransaction));
  console.log("recivedTransaction", Sum(recivedTransaction));

  return (
    <div className=" TransactionHeader_container">
      <div className=" flex flex-col items-center">
        <div
          className="transactoin_value"
          style={{ color: "#ffd700", display: "flex", alignItems: "center" }}
        >
          {" "}
          {Sum(recivedTransaction) - Sum(paiedTransaction)}
          <p style={{ padding: "0", margin: "0", fontSize: "18px" }}> KWD</p>
        </div>
        <div className="transactoin_title"> الرصيد الحالي</div>
      </div>
      <div className=" flex items-center justify-around w-full">
        <div className=" flex items-center flex-col">
          <div
            className="transactoin_value"
            style={{ display: "flex", alignItems: "center" }}
          >
            {" "}
            {Sum(recivedTransaction)}
            <p style={{ padding: "0", margin: "0", fontSize: "18px" }}> KWD</p>
          </div>
          <div className="transactoin_title">الرصيد المستقبل</div>
        </div>
        <div className=" flex flex-col items-center">
          <div
            className="transactoin_value "
            style={{ display: "flex", alignItems: "center" }}
          >
            {Sum(paiedTransaction)}{" "}
            <p style={{ padding: "0", margin: "0", fontSize: "18px" }}> KWD</p>
          </div>
          <div
            style={{ color: "#ffd700" }}
            className="transactoin_title  current"
          >
            الرصيد المدفوع
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
