import React, { useEffect, useState } from "react";
import "./style.css";
import { Select } from "antd";
import GradeImage from "../../assets/logo/log.png";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { base_url } from "../../constants";

const MyOffers = () => {
  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));

  const navigate = useNavigate();
  const [Offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Filter options
  const filterOptions = [
    { value: "all", label: "جميع الطلبات" },
    { value: "pending", label: "قيد الانتظار" },
    { value: "accepted", label: "مقبول" },
    { value: "finished", label: "مكتمل" },
    { value: "canceled", label: "ملغي" },
  ];

  const handelSelectOffers = () => {
    setLoading(true);
    const dataSend = {
      student_id: NagahUser?.student_id,
    };
    axios
      .post(
        base_url + `/user/uber_part/get_student_requests.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          const offersData = Array.isArray(res.data.message)
            ? res.data.message
            : [];
          setOffers(offersData);
          setFilteredOffers(offersData);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  // Filter offers based on selected status
  const handleFilterChange = (value) => {
    setSelectedStatus(value);

    if (value === "all") {
      setFilteredOffers(Offers);
    } else {
      const filtered = Offers.filter((offer) => {
        // Assuming the status field is named 'status' in your API response
        // Adjust the field name based on your actual API response structure
        return offer.status === value || offer.request_status === value;
      });
      setFilteredOffers(filtered);
    }
  };

  useEffect(() => {
    handelSelectOffers();
  }, []);

  // Update filtered offers when Offers array changes
  useEffect(() => {
    handleFilterChange(selectedStatus);
  }, [Offers, selectedStatus]);

  const NeedAnOtherOffer = () => {
    localStorage.removeItem("NeedOffer");
    navigate(`/offer-form`);
  };
  const statusPriority = (status = "") => {
    switch (status.toLowerCase()) {
      case "pending":
      case "offered":
        return 0; // first
      case "accepted":
        return 1; // second
      case "canceled":
      case "cancelled":
        return 2; // third
      default:
        return 99; // unknowns go last
    }
  };

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    const pa = statusPriority(a.status);
    const pb = statusPriority(b.status);
    if (pa !== pb) return pa - pb; // status group order
    // within same group: newest first (desc by created_at)
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handelRemoveRequest = (e, request_id) => {
    e.stopPropagation();

    const dataSend = {
      request_id: request_id,
    };

    console.log(dataSend);

    axios
      .post(
        base_url + `/user/uber_part/cancle_my_request.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res?.data?.message);
          handelSelectOffers();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  // Get status badge color and text
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "#ffa500", text: "قيد الانتظار" },
      accepted: { color: "#4caf50", text: "مقبول" },
      finished: { color: "#2196f3", text: "مكتمل" },
      canceled: { color: "#f44336", text: "ملغي" },
    };

    return statusConfig[status] || { color: "#757575", text: "غير محدد" };
  };

  return (
    <>
      <div className="offers_page" style={{ direction: "rtl" }}>
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6 p-4">
          <button className="need_another_offer m-0" onClick={NeedAnOtherOffer}>
            تقديم طلب اخر
          </button>

          {/* Filter dropdown - Custom styled to match button */}
          <div className="filter_container relative">
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-50 h-12 px-4 pr-10 font-bold text-yellow-400 bg-gradient-to-br from-purple-900 to-purple-800 border-2 border-yellow-400 rounded-lg shadow-lg hover:border-yellow-300 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300 cursor-pointer appearance-none"
              style={{
                background: "linear-gradient(135deg, #3b003b 0%, #4a0e4e 100%)",
                boxShadow: "0 4px 15px rgba(255, 215, 0, 0.2)",
                minWidth: "200px",
              }}
            >
              {filterOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-purple-900 text-yellow-400 font-bold"
                  style={{
                    backgroundColor: "#3b003b",
                    color: "#ffd700",
                  }}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="results_count p-4">
          <span style={{ color: "#ffd700", fontSize: "16px" }}>
            عدد النتائج: {filteredOffers.length} من {Offers.length}
          </span>
        </div>

        <div className="mb-12">
          {loading ? (
            <div className="Loading flex justify-center items-center h-64">
              <div className="text-center">
                <ClockLoader size={100} color="#ffd700" />
                <p
                  style={{
                    margin: "10px 0",
                    padding: "0px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#ffd700",
                  }}
                >
                  جاري التحميل...
                </p>
              </div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="Loading flex justify-center items-center h-64">
              <div className="text-center">
                <p
                  style={{
                    margin: "10px 0",
                    padding: "0px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffd700",
                  }}
                >
                  {selectedStatus === "all"
                    ? "لا توجد طلبات"
                    : `لا توجد طلبات ${
                        filterOptions.find(
                          (opt) => opt.value === selectedStatus
                        )?.label
                      }`}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-[20px] gap-6 w-full">
              {sortedOffers?.map((request, index) => (
                <div
                  key={request?.request_id || index}
                  className="group flex-1 cursor-pointer transform transition-all duration-500 hover:scale-100"
                  onClick={() => {
                    if (
                      request?.status != "pending" ||
                      request?.request_type !== "immediate"
                    ) {
                      return;
                    } else {
                      navigate(`/offer-form/offers/${request?.request_id}`);
                    }
                  }}
                >
                  <div
                    className="relative overflow-hidden h-[400px] rounded-2xl transition-all duration-500 hover:shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
                      border: "3px solid transparent",
                      minWidth: "370px",
                    }}
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                      style={{
                        background:
                          "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
                        filter: "blur(8px)",
                        transform: "scale(1.05)",
                      }}
                    />

                    {/* Status badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg z-20"
                      style={{
                        backgroundColor: getStatusBadge(
                          request?.status || request?.request_status
                        )?.color,
                      }}
                    >
                      {
                        getStatusBadge(
                          request?.status || request?.request_status
                        )?.text
                      }
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />

                    {/* Content container */}
                    <div className="relative z-10 flex flex-col justify-center items-center p-8 h-full">
                      {/* Decorative elements */}
                      <div
                        className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: "#ffd700" }}
                      />
                      <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping" />
                      <div className="absolute bottom-6 left-4 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" />

                      <div className="relative group/image">
                        <div
                          className=" -top-2 right-[50%] translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-purple-900 shadow-lg animate-bounce border-2 border-white"
                          style={{ backgroundColor: "#ffd700" }}
                        >
                          ★
                        </div>

                        {/* Orbital rings */}
                        <div
                          className="absolute inset-0 rounded-full border border-yellow-400/30 animate-pulse"
                          style={{ transform: "scale(1.2)" }}
                        />
                        <div
                          className="absolute inset-0 rounded-full border border-yellow-400/20 animate-pulse"
                          style={{
                            transform: "scale(1.4)",
                            animationDelay: "0.5s",
                          }}
                        />
                      </div>

                      <div className="text-center space-y-4 w-full h-[200px]">
                        <h4
                          className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
                          style={{ color: "#ffd700" }}
                        >
                          {request?.group_type == "individual"
                            ? "فردي"
                            : "مجموعة"}
                        </h4>

                        <h4
                          className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
                          style={{ color: "#ffd700" }}
                        >
                          {request?.request_type == "immediate"
                            ? "الان"
                            : "لاحقا"}
                        </h4>

                        <h4
                          className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
                          style={{ color: "#ffd700" }}
                        >
                          {request?.subject_name}
                        </h4>

                        <h4
                          className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
                          style={{ color: "#ffd700" }}
                        >
                          {request?.scheduled_date}
                        </h4>

                        <h4
                          className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
                          style={{ color: "#ffd700" }}
                        >
                          {request?.scheduled_time}
                        </h4>
                      </div>

                      {/* Only show cancel button for pending requests */}
                      {(request?.status === "pending" ||
                        request?.request_status === "pending") && (
                        <button
                          className="acceptBtn"
                          onClick={(e) =>
                            handelRemoveRequest(e, request?.request_id)
                          }
                        >
                          الغاء الطلب
                        </button>
                      )}

                      <div
                        className="absolute top-12 left-8 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
                        style={{ animationDelay: "0.5s" }}
                      />
                      <div
                        className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-pulse"
                        style={{ animationDelay: "1s" }}
                      />
                      <div
                        className="absolute top-20 right-16 w-1 h-1 bg-yellow-500/30 rounded-full animate-bounce"
                        style={{ animationDelay: "1.5s" }}
                      />
                    </div>

                    {/* Corner decorations */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 opacity-20"
                      style={{
                        background:
                          "linear-gradient(225deg, #ffd700 0%, transparent 70%)",
                        clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-12 h-12 opacity-15"
                      style={{
                        background:
                          "linear-gradient(45deg, #ffd700 0%, transparent 70%)",
                        clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOffers;
