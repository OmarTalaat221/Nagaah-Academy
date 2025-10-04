import axios from "axios";
import Quiz from "../../components/Quiz/Quiz";
import { questions } from "../../utils/data";
import { base_url } from "../../constants";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CryptoJS from "crypto-js";
import { useSearchParams } from "react-router-dom";
import GradeImage from "../../assets/logo/log.png";

export default function QuestionBank() {
  const { id } = useParams();
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const [pageLoading, setPageLoading] = useState(false);
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const [exams, setExams] = useState([
    // {
    //   question_id: 101,
    //   question_text: "ما هو الحرف الأول في كلمة 'تفاحة'؟",
    //   question_image: "//CAMP//apple.jpg",
    //   question_answers: "ت A)/CAMP//ط B)/CAMP//م C)",
    // },
    // {
    //   question_id: 102,
    //   question_text: "كم عدد أصابع اليد الواحدة؟",
    //   question_image: "",
    //   question_answers: "4 A)/CAMP//5 B)/CAMP//6 C)",
    // },
    // {
    //   question_id: 103,
    //   question_text: "ما هو اللون الذي ينتج عن خلط الأزرق مع الأصفر؟",
    //   question_image: "//CAMP//colors.jpg",
    //   question_answers:
    //     "أخضر A)/CAMP//برتقالي B)/CAMP//بنفسجي C)",
    // },
  ]);
  const [course_id] = useSearchParams();
  useEffect(() => {
    const getCourses = () => {
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
        unit_id: id,
        course_id: course_id.get("course_id"),
      };
      axios
        .post(
          base_url + "/user/courses/select_questions.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status == "success") {
            setExams(res?.data?.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setPageLoading(false);
        });
    };
    getCourses();
  }, []);
  console.log(exams);

  return (
    <div
      style={{
        padding: "10px",
        textAlign: "center",
        direction: "rtl",
        maxHeight: "100vh",
        color: "white",
      }}
    >
      <h1>بنك الاسئله</h1>
      {exams.length > 0 ? (
        <div style={{ width: "100%", direction: "rtl" }}>
          <Quiz data={exams} />
        </div>
      ) : (
        <div style={{ width: "100%", padding: "50px 0" }}>
          <h1>لا يوجد </h1>
        </div>
      )}
    </div>
  );
}
