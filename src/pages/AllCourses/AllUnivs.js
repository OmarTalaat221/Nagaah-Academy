import React, { useEffect, useState } from "react";
import "./allcourses.css";
import Footer from "../../components/Footer/Footer";
import CryptoJS from "crypto-js";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate } from "react-router";
import { base_url } from "../../constants";
import axios from "axios";

const AllUnivs = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  useEffect(() => {
    const getCourses = () => {
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
      };
      axios
        .post(
          base_url + "/user/universities/select_university.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status === "success") {
            setCourses(res.data.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setPageLoading(false);
        });
    };
    getCourses();
  }, []);

  return (
    <>
      <div className="allcourses">
        <div className="all_course-title">
          <h3
            style={{
              marginTop: "50px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            اضغط على المرحلة أدناه لرؤية المناهج المتاحة لها
          </h3>
          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "30px",
              fontSize: "15px",
              color: "grey",
            }}
          >
            لكل مرحلة دورات خاصة مصممة لطلابها، لذا نضمن لك مستوى عاليًا من
            التعليم والخبرة.
          </p>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: 900 }}>
          الجامعات
        </h2>

        <div className="courses_content py-2">
          {pageLoading ? (
            <div style={{ width: "100vw " }}>
              <Loader />{" "}
            </div>
          ) : courses && courses?.length > 0 ? (
            courses.map((item) => {
              return (
                <div
                  key={item.university_id}
                  className="course-card"
                  onClick={() => {
                    navigate("/allgrades/" + item?.university_id);
                  }}
                >
                  <div className="main">
                    {item?.image_url && item?.image_url?.length ? (
                      <img
                        className="univ_image"
                        src={item?.image_url}
                        alt={item?.university_name}
                        width={40}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                    ) : null}
                    <div
                      className="course-title unive_Title"
                      style={{ flexWrap: "wrap" }}
                    >
                      <h2 style={{ fontSize: "33px" }}>
                        {item?.university_name}
                      </h2>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <MdPlayLesson className="icon" />
              <h5>لا توجد دورات</h5>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllUnivs;
