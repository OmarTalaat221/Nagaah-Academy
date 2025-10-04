import React, { useEffect, useState } from "react";
import "./allcourses.css";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import Footer from "../../components/Footer/Footer";
import CryptoJS from "crypto-js";
import { getCourses } from "./functions/getAll";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const Examslanding = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const [exams, setExams] = useState([]);
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const { id } = useParams();

  useEffect(() => {
    setExams([]);
  }, []);

  console.log(courses);

  return (
    <>
      <div className="allcourses">
        {}

        <div className="exams-info">
          <h3
            style={{
              marginTop: "50px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Exams Overview
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
            <p>
              {" "}
              - We offer to you exams for every course you subscribed each exam
              has an important questions with a timer to test yourself before
              you enter to your university exam.
            </p>{" "}
            <p>
              {" "}
              - Exams will be available after you subscribed the course. for
              example, anatomy exam will appear after you subscribe anatomy
              course.
            </p>
          </p>
          <h4
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Mechanism of our exams
          </h4>
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
            you will choose the right answer and every questions have one minute
            to solve it and at the end your score will be shown to you.
          </p>

          <ol
            style={{
              textAlign: "left",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "30px",
              fontSize: "15px",
              color: "grey",
            }}
          >
            <div
              className="exams_card_container"
              style={{ gap: "10px", justifyContent: "flex-start" }}
            >
              {exams && exams?.length
                ? exams?.map((item) => {
                    return (
                      <div
                        className="exam_card"
                        onClick={() => {
                          navigate(`/examQuestion/${item?.exam_id}`, {
                            state: {
                              timer: item?.exam_time,
                            },
                          });
                        }}
                      >
                        <h2>{item?.exam_name}</h2>
                        <div>
                          <p>Description: {item?.exam_description}</p>
                          <p>Time Allowed: {item?.exam_time} Min.</p>
                          <p>End Date: {item?.end_date}</p>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
            <Link
              to="/signup"
              className="btn btn-secondary"
              style={{
                display: "block",
                textAlign: "center",
                margin: "20px auto",
              }}
            >
              Register For More Exams Now
            </Link>
          </ol>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Examslanding;
