import axios from "axios";
import { base_url } from "../../../constants/index";
import { showToogleTooltib } from "../../../store/reducers/tooltibReducer";

export const getCourses = (
  userData,
  setPageLoading,
  setCourses,
  setOriginalCourses,
  dispatch
) => {
  const data_send = {
    student_id: userData?.student_id,
    token_value: userData?.token_value,
  };
  axios
    .post(
      base_url + '/user/courses/select_my_courses.php',
      JSON.stringify(data_send)
    )
    .then((res) => {
      if (res.data.status == 'success') {
        setCourses(res.data.message);
        setOriginalCourses(res.data.message);
      } else if (res.data.status == 'out') {
        localStorage.clear();
        setCourses([]);
        window.location.reload();
      } else {
        dispatch(showToogleTooltib());
      }
    })
    .catch((e) => {
      console.log(e);
      setCourses([]);
      dispatch(showToogleTooltib());
    })
    .finally(() => {
      setPageLoading(false);
    });
};
