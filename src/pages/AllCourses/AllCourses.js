import React, { useEffect, useState } from "react";
import "./allcourses.css";
import Footer from "../../components/Footer/Footer";

import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { base_url } from "../../constants";
import { toast } from "react-toastify";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";
import { FaSpinner } from "react-icons/fa";

const AllCourses = () => {
  const userData = JSON.parse(localStorage.getItem("NagahUser"));
  console.log(userData);

  const navigate = useNavigate();

  // const grades = [
  //   {
  //     id: 1,
  //     title: "المرحلة  الابتدائيه",
  //     description:
  //       "المرحلة  الابتدائيه هي مرحلة تعليمية تلي المرحلة الابتدائيه وتؤهل الطالب للمرحله الثانويه.",
  //     image: GradeImage,
  //   },
  //   {
  //     id: 2,
  //     title: "المرحلة المتوسطه",
  //     description:
  //       "المرحلة المتوسطه هي مرحلة تعليمية تلي المرحلة الإعدادية وتؤهل الطالب للجامعة.",
  //     image: GradeImage,
  //   },
  //   {
  //     id: 3,
  //     title: "المرحلة  الثانويه ",
  //     description:
  //       "المرحلة  الثانويه  هي مرحلة تعليمية تلي المرحلة الإعدادية وتؤهل الطالب للجامعة.",
  //     image: GradeImage,
  //   },
  // ];

  const [grades, setGrades] = useState([]);
  console.log("ddk");

  const getData = () => {
    // const dataSend = {
    //   university_id: userData?.university_id,
    //   student_id: userData?.student_id,
    // };

    // https://camp-coding.online/Teacher_App_2025/Nagah_kw/user/auth/select_universities_grade.php/
    axios
      .get(base_url + `/user/auth/select_universities_grade.php`)
      .then((res) => {
        console.log(res);

        if (res.data.status == "success") {
          setGrades(res?.data?.message);
          console.log(grades);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getData();
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
              fontSize: "40px",
              fontWeight: "bold",
              color: "white",

              textShadow: "3px 0px 0px black",
            }}
          >
            اضغط على المرحله أدناه لرؤية الفصول المتاحة لها
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
              fontWeight: "bold",
              textShadow: "2px 0px 0px black",
            }}
          >
            كل المرحله لديها فصول مخصصة لطلابها، لذا نضمن لك مستوى عالٍ من
            التعليم والخبرة.
          </p>
        </div>

        <h2
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "30px",
            fontWeight: 900,
            textShadow: "2px 0px 0px black",
          }}
        >
          المراحل المتاحة
        </h2>

        <div
          style={{
            width: "80%",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "30px 0",
            direction: "rtl",
          }}
        >
          {grades.map((grade) => {
            return (
              <span
                className="grade_card"
                key={grades?.university_id}
                onClick={() =>
                  navigate(`${grade?.university_id}/allgrades`, {
                    state: grade,
                  })
                }
              >
                <div className="w-full h-[200px]">
                  <AsyncImage
                    key={grade?.university_id}
                    src={grade?.image_url}
                    Transition={Blur}
                    style={{ width: "60%", margin: "auto", height: "100%" }}
                    loader={
                      <div className="flex justify-center items-center h-full">
                        <FaSpinner className="animate-spin text-white" />
                      </div>
                    }
                  />
                </div>
                <p style={{ fontSize: "30px", textAlign: "center" }}>
                  {grade?.university_name}
                </p>
                <p
                  style={{
                    fontSize: "18px",
                    textAlign: "center",
                    height: "100px",
                  }}
                >
                  {grade?.description}
                </p>
              </span>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllCourses;
