import axios from "axios";
import { base_url } from "../../../constants/index";

export const getCourses = (
  userData,
  setPageLoading,
  setCourses,
  setOriginalCourses,
  id,
  type
) => {
  const data_send = {
    student_id: userData?.student_id,
    token_value: userData?.token_value,
    grade_id: id,
    type,
  };
  if (type == "home") {
    axios
      .post(
        base_url + "/user/courses/select_courses.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.data.status == "success") {
          setCourses(res.data.message);
          setOriginalCourses(res.data.message);
        } else if (res.data.status == "out") {
          localStorage.clear();
          // window.location.reload();
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  } else {
    axios
      .post(
        base_url + "/user/courses/select_courses_grade.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.data.status == "success") {
          setCourses(res.data.message);
          setOriginalCourses(res.data.message);
        } else if (res.data.status == "out") {
          localStorage.clear();
          // window.location.reload();
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  }
};

// ================================
// import axios from "axios";
// import { base_url } from "../../../constants/index";

// export const getCourses = (
//   userData,
//   setPageLoading,
//   setCourses,
//   setOriginalCourses
// ) => {
//   const data_send = {
//     student_id: userData?.student_id,
//     token_value: userData?.token_value,
//   };
//   axios
//     .post(
//       base_url + '/user/courses/select_courses.php',
//       JSON.stringify(data_send)
//     )
//     .then((res) => {
//       if (res.data.status == 'success') {
//         setCourses(res.data.message);
//         setOriginalCourses(res.data.message);
//       } else if (res.data.status == 'out') {
//         localStorage.clear();
//         window.location.reload();
//       }
//     })
//     .catch((e) => console.log(e))
//     .finally(() => {
//       setPageLoading(false);
//     });
// };
