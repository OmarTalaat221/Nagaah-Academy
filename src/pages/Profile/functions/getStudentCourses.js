import axios from "axios";
import { base_url } from "../../../constants";

export const getStdCourses = (
  userData,
  setPageLoading,
  setCourses,
  setOriginalCourses,
  setCmpCourses
) => {
  setPageLoading(true);
  const data_send = {
    student_id: userData?.student_id,
    token_value: userData?.token_value,
  };
  axios
    .post(
      base_url + "/user/courses/select_my_courses.php",
      JSON.stringify(data_send)
    )
    .then((res) => {
      if (res.data.status == "success") {
        let allData = [...res.data.message];
        let pushComp = [];
        let pushNonComp = [];
        for (let i = 0; i < allData.length; i++) {
          if (allData[i].finished_rate >= 100) {
            pushComp.push(allData[i]);
          } else {
            pushNonComp.push(allData[i]);
          }
        }
        setOriginalCourses(pushNonComp);
        setCourses(pushNonComp);
        setCmpCourses(pushComp);
      } else if (res.data.status == "out") {
        localStorage.clear();
        // window.location.reload();
      }
    })
    .catch((e) => console.log(e))
    .finally(() => {
      setPageLoading(false);
    });
};
