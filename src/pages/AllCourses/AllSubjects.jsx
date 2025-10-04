import React, { useEffect, useState } from "react";
import "./allcourses.css";
import Footer from "../../components/Footer/Footer";
import CryptoJS from "crypto-js";
import { getCourses } from "./functions/getAll";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import GradeImage from "../../assets/logo/log.png";
import axios from "axios";
import { base_url } from "../../constants";
import { toast } from "react-toastify";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";
import { FaSpinner } from "react-icons/fa";

const AllSubjects = () => {
  const userData = JSON.parse(localStorage.getItem("NagahUser"));
  console.log(userData);
  const { grade_id } = useParams();

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
    const dataSend = {
      grade_id: grade_id,
    };

    // https://camp-coding.online/Teacher_App_2025/Nagah_kw/user/auth/select_universities_grade.php/
    axios
      .post(
        base_url + `/user/courses/select_courses_grade.php`,
        JSON.stringify(dataSend)
      )
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
            اضغط على الماده أدناه لرؤية المناهج المتاحة لها
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
            لكل ماده مناهج مخصصة لطلابها، لذا نضمن لك مستوى عالٍ من التعليم
            والخبرة.
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
            // width: "fit-content",
            // maxWidth: "90%",
            maxWidth: "90%",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "30px 0",
            direction: "rtl",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {grades.map((grade) => {
            return (
              <span
                className="grade_card"
                style={{ maxWidth: "300px" }}
                key={grades?.university_id}
                onClick={() => navigate(`/login`)}
              >
                <div className="w-full bg-transparent h-[150px]">
                  <AsyncImage
                    src={grade?.course_photo_url}
                    Transition={Blur}
                    alt=""
                    loader={
                      <div className="flex bg-transparent justify-center items-center h-full">
                        <FaSpinner className="animate-spin text-white" />
                      </div>
                    }
                    style={{
                      backgroundColor: "transparent",
                      width: "100%",
                      height: "150px",
                      margin: "auto",
                      display: "block",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p style={{ fontSize: "25px", textAlign: "center" }}>
                  {grade?.course_name}
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

export default AllSubjects;
