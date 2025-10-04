import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./coursedetails.css";
import { Collapse, Modal, Select } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons"; // استيراد الأيقونات
import Footer from "../../components/Footer/Footer";
import { MdVideoLibrary } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import GradeImage from "../../assets/logo/log.png";
// import teacherImg from "../../assets/teacher.jpeg";
import { Rate } from "antd";

const { Panel } = Collapse;

const CourseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const [ReservisdionModal, setReservisdionModal] = useState(null);
  const courseContents = [
    // 📌 فيديوهات لدورة 1

    {
      id: 1,
      courseId: 1,
      type: "video",
      title: "الوحدة الأولى: أساسيات الرياضيات",
      videos: [
        {
          id: 101,
          title: "مقدمة عن الرياضيات",
          url: "https://example.com/math-intro.mp4",
        },
        {
          id: 102,
          title: "الأعداد الصحيحة",
          url: "https://example.com/integers.mp4",
        },
        {
          id: 103,
          title: "الجبر الأساسي",
          url: "https://example.com/algebra.mp4",
        },
        {
          id: 104,
          title: "المعادلات الخطية",
          url: "https://example.com/linear-equations.mp4",
        },
      ],
    },
    {
      id: 2,
      courseId: 1,
      type: "video",
      title: "الوحدة الثانية: الهندسة والقياس",
      videos: [
        {
          id: 105,
          title: "المثلثات",
          url: "https://example.com/triangles.mp4",
        },
        {
          id: 106,
          title: "حساب التفاضل",
          url: "https://example.com/calculus.mp4",
        },
        {
          id: 107,
          title: "الإحصاء",
          url: "https://example.com/statistics.mp4",
        },
        { id: 108, title: "النهايات", url: "https://example.com/limits.mp4" },
      ],
    },
    {
      id: 3,
      courseId: 2,
      type: "video",
      title: "الوحدة الأولى: قواعد اللغة العربية",
      videos: [
        {
          id: 201,
          title: "قواعد النحو الأساسية",
          url: "https://example.com/grammar.mp4",
        },
        {
          id: 202,
          title: "إعراب الجمل",
          url: "https://example.com/sentence-structure.mp4",
        },
        {
          id: 203,
          title: "الصرف والتحليل",
          url: "https://example.com/sarf.mp4",
        },
        {
          id: 204,
          title: "الإملاء والتشكيل",
          url: "https://example.com/spelling.mp4",
        },
      ],
    },
    {
      id: 4,
      courseId: 2,
      title: "الوحدة الثانية: مهارات الكتابة والتعبير",
      type: "video",
      videos: [
        {
          id: 205,
          title: "كتابة المقال",
          url: "https://example.com/essay-writing.mp4",
        },
        {
          id: 206,
          title: "فن الإلقاء",
          url: "https://example.com/public-speaking.mp4",
        },
        {
          id: 207,
          title: "تحليل النصوص",
          url: "https://example.com/text-analysis.mp4",
        },
        {
          id: 208,
          title: "التعبير الإبداعي",
          url: "https://example.com/creative-writing.mp4",
        },
      ],
    },

    // 📌 اختبارات لدورة 1
    {
      id: 1,
      title: "اختبارات الوحدة 1-2",
      type: "exam",
      exams: [
        {
          id: 9,
          title: "اختبار الوحدة 1",
          url: "https://example.com/math-exam1.pdf",
        },
        {
          id: 10,
          title: "اختبار الوحدة 2",
          url: "https://example.com/math-exam2.pdf",
        },
      ],
    },
    {
      id: 2,
      title: "اختبارات الوحدة 3-4",
      type: "exam",
      exams: [
        {
          id: 11,
          title: "اختبار الوحدة 3",
          url: "https://example.com/math-exam3.pdf",
        },
        {
          id: 12,
          title: "اختبار الوحدة 4",
          url: "https://example.com/math-exam4.pdf",
        },
      ],
    },
    {
      id: 3,
      title: "اختبارات الوحدة 5-6",
      type: "exam",
      exams: [
        {
          id: 13,
          title: "اختبار الوحدة 5",
          url: "https://example.com/math-exam5.pdf",
        },
        {
          id: 14,
          title: "اختبار الوحدة 6",
          url: "https://example.com/math-exam6.pdf",
        },
      ],
    },
    {
      id: 4,
      title: "اختبارات الوحدة 7-8",
      type: "exam",
      exams: [
        {
          id: 15,
          title: "اختبار الوحدة 7",
          url: "https://example.com/math-exam7.pdf",
        },
        {
          id: 16,
          title: "اختبار الوحدة 8",
          url: "https://example.com/math-exam8.pdf",
        },
      ],
    },

    // 📌 كتب إلكترونية لدورة 1
    {
      id: 1,
      title: "وحدة 1: الفصول 1-2",
      type: "eBook",
      ebooks: [
        {
          id: 17,
          title: "كتاب الرياضيات - الفصل 1",
          url: "https://example.com/math-book1.pdf",
        },
        {
          id: 18,
          title: "كتاب الرياضيات - الفصل 2",
          url: "https://example.com/math-book2.pdf",
        },
      ],
    },
    {
      id: 2,
      title: "وحدة 2: الفصول 3-4",
      type: "eBook",
      ebooks: [
        {
          id: 19,
          title: "كتاب الرياضيات - الفصل 3",
          url: "https://example.com/math-book3.pdf",
        },
        {
          id: 20,
          title: "كتاب الرياضيات - الفصل 4",
          url: "https://example.com/math-book4.pdf",
        },
      ],
    },
    {
      id: 3,
      title: "وحدة 3: الفصول 5-6",
      type: "eBook",
      ebooks: [
        {
          id: 21,
          title: "كتاب الرياضيات - الفصل 5",
          url: "https://example.com/math-book5.pdf",
        },
        {
          id: 22,
          title: "كتاب الرياضيات - الفصل 6",
          url: "https://example.com/math-book6.pdf",
        },
      ],
    },
    {
      id: 4,
      title: "وحدة 4: الفصول 7-8",
      type: "eBook",
      ebooks: [
        {
          id: 23,
          title: "كتاب الرياضيات - الفصل 7",
          url: "https://example.com/math-book7.pdf",
        },
        {
          id: 24,
          title: "كتاب الرياضيات - الفصل 8",
          url: "https://example.com/math-book8.pdf",
        },
      ],
    },
  ];

  console.log(courseContents);

  const videos =
    courseContents?.filter((course) => course.type == "video") || [];

  const EBooks =
    courseContents?.filter((course) => course.type == "eBook") || [];

  const Exams = courseContents?.filter((course) => course.type == "exam") || [];

  const subjects = [
    {
      id: 1,
      name: "ا/محمد احمد",
      role: "مدرس رياضيات",
      description: "خبرة 10 سنوات في تدريس الرياضيات للمرحلة الإعدادية.",
      classId: 1,
      image: teacherImg,
      rating: 4.5,
    },
    {
      id: 2,
      name: "ا/محمد احمد",
      role: "مدرس علوم",
      description: "متخصص في الفيزياء والكيمياء، خبرة في إعداد الاختبارات.",
      classId: 1,
      image: teacherImg,
      rating: 3.5,
    },
    {
      id: 3,
      name: "ا/محمد احمد",
      role: "مدرس لغة عربية",
      description:
        "خبير في قواعد اللغة العربية والأدب، مع خبرة تدريسية 15 عامًا.",
      classId: 2,
      image: teacherImg,
    },
    {
      id: 4,
      name: "ا/محمد احمد",
      role: "مدرس لغة إنجليزية",
      description: "مدرس لغة إنجليزية معتمد، متخصص في المناهج الحديثة.",
      classId: 2,
      image: teacherImg,
      rating: 4.5,
    },
    {
      id: 5,
      name: "ا/محمد احمد",
      role: "مدرس فيزياء",
      description:
        "مدرس فيزياء للمرحلة الثانوية، حاصل على شهادات في التدريس المتقدم.",
      classId: 4,
      image: teacherImg,
      rating: 6,
    },
    {
      id: 6,
      name: "ا/محمد احمد",
      role: "مدرس كيمياء",
      description: "متخصص في الكيمياء العضوية والتحليلية، خبرة في المختبرات.",
      classId: 4,
      image: teacherImg,
      rating: 5,
    },
    {
      id: 7,
      name: "ا/محمد احمد",
      role: "مدرس أحياء",
      description: "متخصص في علم الأحياء وعلم الوراثة، خبرة تدريسية 12 عامًا.",
      classId: 5,
      image: teacherImg,
      rating: 2.5,
    },
  ];

  const lessonTimes = [
    { id: 1, label: "08:00 AM - 09:00 AM", value: "08:00-09:00" },
    { id: 2, label: "09:00 AM - 10:00 AM", value: "09:00-10:00" },
    { id: 3, label: "10:00 AM - 11:00 AM", value: "10:00-11:00" },
    { id: 4, label: "11:00 AM - 12:00 PM", value: "11:00-12:00" },
    { id: 5, label: "12:00 PM - 01:00 PM", value: "12:00-13:00" },
    { id: 6, label: "01:00 PM - 02:00 PM", value: "13:00-14:00" },
    { id: 7, label: "02:00 PM - 03:00 PM", value: "14:00-15:00" },
    { id: 8, label: "03:00 PM - 04:00 PM", value: "15:00-16:00" },
  ];

  return (
    <>
      <div className="allcourses grades" style={{ direction: "rtl" }}>
        <div className="course_videos_panner">
          <p
            style={{
              fontSize: "70px",
              fontWeight: "bold",
              color: "#fb9700",
            }}
          >
            {location?.state?.course_details?.name}
          </p>
        </div>
        <div className="all_course-title"></div>

        <div className="course_videos">
          <p>فيديوهات {location?.state?.course_details?.name}</p>
          <Collapse
            defaultActiveKey={videos?.length > 0 ? [videos[0].id] : []}
            accordion
            expandIcon={({ isActive }) =>
              isActive ? (
                <UpOutlined
                  style={{ fontSize: "20px", backgroundColor: "#6121a0" }}
                />
              ) : (
                <DownOutlined
                  style={{
                    fontSize: "20px",
                    backgroundColor: "#6121a0",
                    borderRadius: "5px",
                  }}
                />
              )
            }
          >
            {videos?.map((unit) => (
              <Panel
                style={{ padding: "15px 10px" }}
                header={unit?.title}
                key={unit.id}
              >
                {unit?.videos?.map((vid) => (
                  <p
                    key={vid.id}
                    className="vid_title"
                    style={{ paddingLeft: "15px" }}
                  >
                    <MdVideoLibrary
                      size={20}
                      color="black"
                      style={{ backgroundColor: "black", margin: "0px 10px" }}
                    />{" "}
                    {vid?.title}
                  </p>
                ))}
              </Panel>
            ))}
          </Collapse>
        </div>

        <div className="course_videos">
          <p>كتب {location?.state?.course_details?.name}</p>
          <Collapse
            defaultActiveKey={EBooks?.length > 0 ? [EBooks[0].id] : []}
            accordion
            expandIcon={({ isActive }) =>
              isActive ? (
                <UpOutlined
                  style={{ fontSize: "20px", backgroundColor: "#6121a0" }}
                />
              ) : (
                <DownOutlined
                  style={{
                    fontSize: "20px",
                    backgroundColor: "#6121a0",
                    borderRadius: "5px",
                  }}
                />
              )
            }
          >
            {EBooks?.map((unit) => (
              <Panel
                style={{ padding: "15px 10px" }}
                header={unit?.title}
                key={unit.id}
              >
                {unit?.ebooks?.map((ebook) => (
                  <p
                    key={ebook.id}
                    className="vid_title"
                    style={{ paddingLeft: "15px" }}
                  >
                    <FaBook
                      size={20}
                      color="black"
                      style={{ backgroundColor: "black", margin: "0px 10px" }}
                    />
                    {ebook?.title}
                  </p>
                ))}
              </Panel>
            ))}
          </Collapse>
        </div>

        <div className="course_videos">
          <p>امتحانات {location?.state?.course_details?.name}</p>
          <Collapse
            defaultActiveKey={Exams?.length > 0 ? [Exams[0].id] : []}
            accordion
            expandIcon={({ isActive }) =>
              isActive ? (
                <UpOutlined
                  style={{ fontSize: "20px", backgroundColor: "#6121a0" }}
                />
              ) : (
                <DownOutlined
                  style={{
                    fontSize: "20px",
                    backgroundColor: "#6121a0",
                    borderRadius: "5px",
                  }}
                />
              )
            }
          >
            {Exams?.map((unit) => (
              <Panel
                style={{ padding: "15px 10px" }}
                header={unit?.title}
                key={unit.id}
              >
                {unit?.exams?.map((exam) => (
                  <p
                    key={exam.id}
                    className="vid_title"
                    style={{ paddingLeft: "15px" }}
                  >
                    {exam?.title}
                  </p>
                ))}
              </Panel>
            ))}
          </Collapse>
        </div>

        <div
          style={{
            flexWrap: "wrap",
            width: "90%",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            padding: "0px 30px 0px 0",
            direction: "rtl",
          }}
        >
          {subjects.map((item) => {
            return (
              <span
                className="subject_teacher"
                key={item?.id}
                onClick={() =>
                  navigate(`/book-lesson/teacher/${item?.id}`, {
                    state: { teacher_data: item },
                  })
                }
              >
                <img
                  src={item?.image}
                  alt=""
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "10px",
                  }}
                />
                <p style={{ fontSize: "30px", textAlign: "center" }}>
                  {item?.name}
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    textAlign: "center",
                    width: "80%",
                    margin: "auto",
                    height: "80px",
                  }}
                >
                  {item?.description}
                </p>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Rate value={2.5} allowHalf style={{ color: "#fb9700" }} />
                </div>
              </span>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
