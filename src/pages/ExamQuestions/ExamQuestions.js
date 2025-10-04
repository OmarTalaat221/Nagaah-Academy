import { questions } from "../../utils/data";
import Quiz from "../../components/Quiz/Quiz";
import { useLocation, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { base_url } from "../../constants";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";

export default function ExamQuestions() {
  const { id } = useParams();
  const location = useLocation();
  const timer = location?.state?.timer;
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const [pageLoading, setPageLoading] = useState(false);
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(userData);
    if (userData && userData?.student_id) {
      const getCourses = () => {
        const data_send = {
          student_id: userData?.student_id,
          token_value: userData?.token_value,
          exam_id: id,
        };

        setPageLoading(true);
        axios
          .post(
            base_url + "/user/courses/select_exam_questions.php",
            JSON.stringify(data_send)
          )
          .then((res) => {
            if (res.data.status == "success") {
              setExams(res.data.message);
            }
          })
          .catch((e) => console.log(e))
          .finally(() => {
            setPageLoading(false);
          });
      };
      getCourses();
    } else {
      setExams([]);
    }
  }, []);
  return (
    <>
      {pageLoading ? (
        <div className="flex items-center justify-center ">
          <Loader />
        </div>
      ) : exams && exams?.length ? (
        <Quiz data={exams} timer={timer} />
      ) : (
        <h1 style={{ textAlign: "center", margin: "auto" }}>No Questions</h1>
      )}
    </>
  );
}
