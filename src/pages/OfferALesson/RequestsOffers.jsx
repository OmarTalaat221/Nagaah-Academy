import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { base_url } from "../../constants";
import { toast } from "react-toastify";
import axios from "axios";
import { ClockLoader } from "react-spinners";

const RequestsOffers = () => {
  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));
  const { request_id } = useParams();
  const [offers, setOffers] = useState([]); // Always initialize as array
  const [loading, setLoading] = useState(true); // Add loading state

  const handelSelectOffers = () => {
    setLoading(true);
    const dataSend = {
      student_id: NagahUser?.student_id,
      request_id: request_id,
    };

    axios
      .post(
        base_url + `/user/uber_part/get_request_offers.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          const offersData = Array.isArray(res.data.message)
            ? res.data.message
            : [];
          setOffers(offersData);
        } else {
          toast.error(res.data.message);
          setOffers([]);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("حدث خطأ في جلب العروض");
        setOffers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handelSelectOffers();
  }, []);

  const handelAccesptOffer = (offer_id) => {
    const dataSend = {
      offer_id: offer_id,
      request_id: request_id,
      student_id: NagahUser?.student_id,
    };

    // Remove this return statement to actually make the API call
    // return console.log(dataSend);

    axios
      .post(
        base_url + `/user/uber_part/accept_offer.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          handelSelectOffers();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("حدث خطأ في قبول العرض");
      });
  };

  return (
    <div className="offers_page" style={{ direction: "rtl" }}>
      <div className="my-12">
        {loading ? (
          <div className="Loading w-full flex justify-center">
            <span className="text-center">
              <ClockLoader size={200} color="#ffd700" />
              <p
                style={{
                  margin: "10px 0",
                  padding: "0px",
                  fontSize: "25px",
                  fontWeight: "bold",
                  color: "#ffd700",
                }}
              >
                جاري تحميل العروض...
              </p>
            </span>
          </div>
        ) : Array.isArray(offers) && offers.length > 0 ? (
          // Show offers if data exists and is array
          offers.map((request, index) => (
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center lg:grid-cols-3 px-[20px] gap-6 w-full">
              <div
                key={index}
                className=" cursor-pointer text-center p-6 rounded-xl bg-gradient-to-br from-[#5e2a5e] to-[#3b003b]
                         shadow-2xl transform transition-all duration-300 hover:scale-100 hover:rotate-1
                         border-4 border-yellow-400 relative overflow-hidden"
                style={{
                  boxShadow: `
                  0 15px 35px rgba(0, 0, 0, 0.3),
                  0 8px 15px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                `,
                  background: "linear-gradient(145deg, #5e2a5e, #3b003b)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5e2a5e] to-[#3b003b] rounded-t-lg"></div>
                <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                <div className="relative z-10 space-y-3">
                  <div className="h-[200px] overflow-hidden rounded-lg">
                    <img
                      src={request?.teacher_img}
                      className="w-full h-full object-contain"
                      alt={request?.teacher_name || "Teacher"}
                      onError={(e) => {
                        // Handle broken images
                        e.target.src =
                          "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                  </div>

                  <p className="text-red-100 font-medium drop-shadow-md">
                    {request?.teacher_name}
                  </p>
                  <p className="text-yellow-100 font-semibold text-base drop-shadow-md">
                    السعر: {request?.price}
                  </p>
                  <p className="text-yellow-100 font-semibold text-base drop-shadow-md">
                    {request?.notes}
                  </p>
                  <button
                    className="acceptBtn bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => handelAccesptOffer(request?.offer_id)}
                  >
                    قبول العرض
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="Loading w-full  items-center flex justify-center">
            <span className="text-center">
              <ClockLoader size={200} color="#ffd700" />
              <p
                style={{
                  margin: "10px 0",
                  padding: "0px",
                  fontSize: "25px",
                  fontWeight: "bold",
                  color: "#ffd700",
                }}
              >
                لا توجد عروض متوفره بعد
              </p>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsOffers;
