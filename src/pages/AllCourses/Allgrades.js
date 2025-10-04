import React, { useEffect, useState } from "react";
import "./allcourses.css";
import Footer from "../../components/Footer/Footer";
import CryptoJS from "crypto-js";
import { MdPlayLesson } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router";
import { base_url } from "../../constants";
import axios from "axios";
import GradeImage from "../../assets/logo/log.png";

import { toast } from "react-toastify";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";
import { FaSpinner } from "react-icons/fa";

const AllGrades = () => {
  const navigate = useNavigate();

  const uniData = useLocation();
  console.log(uniData.state);

  // const [courses, setCourses] = useState([]);
  // const [pageLoading, setPageLoading] = useState(false);
  // const localData = localStorage.getItem("elmataryapp");
  // const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  // const userData =
  //   decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const { id } = useParams();

  // useEffect(() => {
  //   const getCourses = () => {
  //     const data_send = {
  //       student_id: userData?.student_id,
  //       token_value: userData?.token_value,
  //       university_id: id,
  //     };
  //     axios
  //       .post(
  //         base_url + "/user/grades/select_grade_university.php",
  //         JSON.stringify(data_send)
  //       )
  //       .then((res) => {
  //         if (res.data.status === "success") {
  //           setCourses(res.data.message);
  //         }
  //       })
  //       .catch((e) => console.log(e))
  //       .finally(() => {
  //         setPageLoading(false);
  //       });
  //   };
  //   getCourses();
  // }, []);

  // const classes = [
  //   { id: 1, name: "الأول ", gradeId: 1, image: grade1 },
  //   { id: 2, name: "الثاني ", gradeId: 1, image: grade2 },
  //   { id: 3, name: "الثالث ", gradeId: 1, image: grade3 },
  //   { id: 4, name: "الرابع", gradeId: 1, image: grade4 },
  //   { id: 5, name: "الخامس", gradeId: 1, image: grade5 },
  //   { id: 6, name: "السادس", gradeId: 2, image: grade6 },
  //   { id: 7, name: "السابع", gradeId: 2, image: grade7 },
  //   { id: 8, name: "الثامن", gradeId: 2, image: grade8 },
  //   { id: 9, name: "التاسع", gradeId: 3, image: grade9 },
  //   { id: 10, name: "العاشر", gradeId: 3, image: grade10 },
  //   { id: 11, name: "الحادي عشر", gradeId: 3, image: grade11 },
  // ];

  // const arr = classes.filter((grade) => grade.gradeId == id);

  // console.log(arr);

  const [classes, setClasses] = useState([]);

  const getData = () => {
    const dataSend = {
      university_id: id,
    };
    axios
      .post(
        base_url + `/user/grades/select_grade_university.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          setClasses(res?.data?.message);
          console.log(classes.image);
        } else {
          toast.error("someThing went wrong");
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getData();
  }, []);

  const grades = classes.filter((uni) => uni?.university_id == id);

  console.log(grades);
  console.log(classes);

  return (
    <>
      <div className="allcourses grades">
        <div className="all_course-title">
          <h3
            style={{
              marginTop: "50px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "40px",
              fontWeight: "bold",
              color: "white",
              textShadow: "4px 0px 0px rgba(0, 0, 0, 0.534)",
            }}
          >
            اضغط على الصف أدناه لرؤية المناهج المتاحة لها
          </h3>
          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "30px",
              fontSize: "15px",
              color: "white",
              textShadow: "2px 0px 0px rgba(0, 0, 0, 0.534)",
            }}
          >
            لكل صف دورات خاصة مصممة لطلابها، لذا نضمن لك مستوى عاليًا من التعليم
            والخبرة.
          </p>
        </div>

        <h2
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "30px",
            fontWeight: 900,
            textShadow: "2px 0px 0px rgba(0, 0, 0, 0.534)",
          }}
        >
          الصفوف المتاحه
        </h2>

        <div
          style={{
            flexWrap: "wrap",
            width: "fit-content",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            padding: "30px 0",
            direction: "rtl",
            gap: "15px",
          }}
        >
          {classes.map((item, index) => {
            return (
              <span
                className="class_card"
                key={item?.grade_id}
                onClick={() =>
                  navigate(
                    `/courses/${id}/allgrades/${item?.grade_id}/subjects`
                  )
                }
              >
                <div className="w-full h-[200px]">
                  <AsyncImage
                    key={index}
                    src={item?.image}
                    Transition={Blur}
                    style={{
                      width: "60%",
                      margin: "auto",
                      height: "100%",
                      // display: "block",
                    }}
                    loader={
                      <div className="flex justify-center items-center h-full">
                        <FaSpinner className="animate-spin text-white" />
                      </div>
                    }
                  />
                </div>
                <p
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                    width: "90%",
                    margin: "auto",
                    height: "40px",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                  }}
                >
                  الصف {item?.grade_name}
                </p>
                {}
              </span>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllGrades;
