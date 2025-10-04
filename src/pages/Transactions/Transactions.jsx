import React, { useEffect, useState } from "react";
import TransactionHeader from "./_components/TransactionHeader";
import TransactionTable from "./_components/TransactionTable";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../constants";

const Transactions = () => {
  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));

  const [RecivedBalance, setRecivedBalance] = useState([]);
  const [OutBalance, setOutBalance] = useState([]);

  const handelSelectTranseations = () => {
    const dataSend = {
      user_id: NagahUser?.student_id,
    };
    axios
      .post(
        base_url + `/user/wallet/get_user_balance.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          setRecivedBalance(res.data.recived_transaction);
          setOutBalance(res.data.sent_transaction);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    handelSelectTranseations();
    console.log(RecivedBalance, OutBalance);
  }, []);

  const Balance = [...RecivedBalance, ...OutBalance];

  return (
    <div className="pt-4">
      <TransactionHeader
        recivedTransaction={RecivedBalance}
        paiedTransaction={OutBalance}
      />
      <TransactionTable Transactions={Balance} />
    </div>
  );
};

export default Transactions;
