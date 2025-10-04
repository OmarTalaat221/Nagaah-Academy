import { Button, Card, Col, Radio, Row, Tag } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { Space } from "antd";
import "./style.css";
import DataTable, {
  getColumnDateProps,
  getColumnNumberRange,
  getColumnSearchProps,
} from "../../../components/CusomeTabel/DataTable";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useState } from "react";

const formattedDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return "Invalid Date"; // Handle invalid date
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const formatDate = (date) => {
  return date.toLocaleString("en-US", {
    timeZone: "Africa/Cairo",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));

// helper
const isIncoming = (row) => row?.sender_data?.id !== NagahUser?.student_id;

const headers = [
  {
    title: "تاريخ العملية",
    dataIndex: "transaction_date", // make sure your data uses this field
    key: "transaction_date",
    align: "left",
    ...getColumnDateProps("transaction_date"),
    sorter: (a, b) =>
      new Date(a.transaction_date).getTime() -
      new Date(b.transaction_date).getTime(),
    sortDirections: ["descend", "ascend"],
    // defaultSortOrder: "descend",
    render: (date, row) => {
      const incoming = isIncoming(row);
      return (
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-full ${
              incoming ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {incoming ? <FaArrowDown /> : <FaArrowUp />}
          </div>
          <div>{formatDate(new Date(date))}</div>
        </div>
      );
    },
  },
  {
    title: "النوع",
    dataIndex: "type",
    key: "type",
    align: "center",
    filterMultiple: false,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys = [],
      confirm,
      clearFilters,
    }) => {
      const val = selectedKeys[0];
      return (
        <div style={{ padding: 8, width: 220, direction: "rtl" }}>
          <Radio.Group
            value={val}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <Radio value="in">إيداع</Radio>
            <Radio value="out">سحب</Radio>
          </Radio.Group>

          <Space
            style={{
              marginTop: 8,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="primary"
              size="small"
              onClick={() => confirm({ closeDropdown: true })}
            >
              تأكيد
            </Button>
            <Button
              size="small"
              onClick={() => {
                clearFilters?.();
                confirm({ closeDropdown: true });
              }}
            >
              إعادة ضبط
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => (isIncoming(record) ? "in" : "out") === value,

    // keep your sorter and render as you had:
    sorter: (a, b) => {
      const ai = isIncoming(a) ? 1 : 0;
      const bi = isIncoming(b) ? 1 : 0;
      if (ai !== bi) return bi - ai;
      return (a.type || "").localeCompare(b.type || "", "ar", {
        sensitivity: "base",
      });
    },
    render: (type, row) => {
      const incoming = isIncoming(row);
      return (
        <Tag
          color={incoming ? "green" : "red"}
          className={incoming ? "text-green-500" : "text-red-500"}
        >
          {incoming ? "إيداع" : "سحب"}
        </Tag>
      );
    },
  },
  {
    title: "السعر",
    dataIndex: "amount",
    key: "amount",
    align: "center",
    ...getColumnNumberRange("amount"),
    sorter: (a, b) => Number(a.amount) - Number(b.amount),
    render: (price) => {
      const value = Number(price);
      return (
        <div style={{ direction: "rtl" }}>
          {Number.isFinite(value) ? value.toLocaleString("ar-KW") : price} KWD
        </div>
      );
    },
  },
  {
    title: "الوصف",
    dataIndex: "describtion",
    key: "describtion",
    align: "center",
    ...getColumnSearchProps("describtion", "بحث في الوصف"),
    sorter: (a, b) =>
      (a.describtion || "").localeCompare(b.describtion || "", "ar", {
        sensitivity: "base",
      }),
  },
];

const TransactionTable = ({ Transactions }) => {
  console.log("Transactions", Transactions);
  const [searchText, setSearchText] = useState("");
  Transactions.sort((a, b) => {
    return new Date(b.transaction_date) - new Date(a.transaction_date);
  });

  console.log("Transactions after sort", Transactions);

  return (
    <div className="mt-4" style={{ width: "90% !important" }}>
      <Col
        xs="24"
        xl={24}
        className="transaction_tabel_container"
        style={{ width: "90%", margin: "auto" }}
      >
        <Card
          title={
            <div className="text-xl" style={{ direction: "rtl" }}>
              معاملاتك الماليه
            </div>
          }
          bordered={false}
        >
          <div
            className=""
            style={{
              width: "90% !important",
              margin: "auto",
              direction: "rtl",
            }}
          >
            <DataTable
              loading={false}
              addBtn={false}
              // onAddClick={() => setAddModal(true)}
              searchPlaceholder={"ابحث عن تاريخ معاملاتك الان..."}
              table={{ header: headers, rows: Transactions }}
              onSearchChabnge={(e) => {
                setSearchText(e.target.value);
              }}
              bordered={true}
              style={{ direction: "rtl", textSize: "25px" }}
            />
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default TransactionTable;
