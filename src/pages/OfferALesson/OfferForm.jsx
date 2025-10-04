import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import "./style.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { base_url } from "../../constants";
import dayjs from "dayjs";

// Import components
import {
  FormHeader,
  LocationSelector,
  RequestTypeSelector,
  UserInfoForm,
  ImmediateRequestForm,
  ScheduledRequestForm,
  SubmitButton,
  TeacherModal,
  TourGuide,
} from "./offerComp";
import SignInModal from "./offerComp/SignInModal";

const OfferForm = () => {
  const navigate = useNavigate();
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if initial data is loaded

  const days = [
    { label: "السبت", value: "saturday" },
    { label: "الأحد", value: "sunday" },
    { label: "الاثنين", value: "monday" },
    { label: "الثلاثاء", value: "tuesday" },
    { label: "الأربعاء", value: "wednesday" },
    { label: "الخميس", value: "thursday" },
    { label: "الجمعه", value: "friday" },
  ];

  const LocalNewOfferData = useMemo(() => {
    return JSON.parse(localStorage.getItem("newOfferData") || "null");
  }, []);

  const openSignModal = () => {
    if (validate()) {
      setOpenSignInModal(true);
    }
  };

  const NagahUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("NagahUser") || "null");
    } catch (e) {
      return null;
    }
  }, []);
  const [experiences, setExperiences] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState({
    teachers: false,
    subjects: false,
    experiences: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [groupsClasses, setGroupsClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [modalTeacher, setModalTeacher] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newOfferData, setNewOfferData] = useState({
    student_id: NagahUser?.student_id ?? null,
    request_type: "immediate",
    subject_id: null,
    group_type: "individual",
    experience_id: null,
    teacher_id: "0",
    scheduled_date: null,
    scheduled_time: null,
    end_time: null,
    location: "online",
    group_id: null,
    group_classes_id: null,
    university_id: null,
    grade_id: NagahUser ? NagahUser?.grade_id : LocalNewOfferData?.grade_id,
  });

  // Initialize data on component mount
  useEffect(() => {
    if (LocalNewOfferData) {
      setNewOfferData((prevData) => ({
        ...LocalNewOfferData,
        scheduled_date: null,
        scheduled_time: null,
        end_time: null,
        grade_id: NagahUser ? NagahUser?.grade_id : LocalNewOfferData?.grade_id,
        student_id:
          NagahUser?.student_id ?? LocalNewOfferData?.student_id ?? null,
      }));

      if (LocalNewOfferData?.teacher_id) {
        setSelectedTeacher(LocalNewOfferData?.teacher_id);
      }

      setIsDataLoaded(true);
    } else {
      setNewOfferData({
        ...newOfferData,
        grade_id: NagahUser ? NagahUser?.grade_id : LocalNewOfferData?.grade_id,
        student_id:
          NagahUser?.student_id ?? LocalNewOfferData?.student_id ?? null,
      });

      setIsDataLoaded(true);
    }
  }, [LocalNewOfferData, NagahUser]);

  useEffect(() => {
    console.log(newOfferData, "newOfferData");
  }, [newOfferData]);

  // Request time options used in RequestTypeSelector component
  // Defined here for consistency with other options

  const lessonTypeOptions = useMemo(() => {
    const options = [{ label: "فردي", value: "individual" }];

    if (newOfferData?.location !== "offline") {
      options.push(
        { label: "مجموعه(1-6) طلاب", value: "small_group" },
        { label: "مجموعه (6 او اكتر) طلاب", value: "large_group" }
      );
    }

    return options;
  }, [newOfferData?.location]);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ label: s?.course_name, value: s?.course_id })),
    [subjects]
  );

  // Update the useMemo for experienceOptions
  const experienceOptions = useMemo(
    () =>
      experiences.map((exp) => ({
        label: exp.experience,
        value: exp.teachers[0]?.experience_id, // Get experience_id from first teacher
      })),
    [experiences]
  );

  // Update teacherOptions to filter by selected experience
  const teacherOptions = useMemo(() => {
    if (!newOfferData?.experience_id) return [];

    const selectedExperience = experiences.find(
      (exp) => exp.teachers[0]?.experience_id === newOfferData.experience_id
    );

    if (!selectedExperience) return [];

    return selectedExperience.teachers.map((t) => ({
      label: t?.teacher_name,
      value: t?.teacher_id,
    }));
  }, [experiences, newOfferData?.experience_id]);

  const teacherObj = useMemo(() => {
    let allTeachers = [];
    experiences.forEach((exp) => {
      allTeachers = [...allTeachers, ...exp.teachers];
    });

    return allTeachers.find(
      (t) => String(t?.teacher_id) === String(selectedTeacher)
    );
  }, [experiences, selectedTeacher]);

  const refWhen = useRef(null);
  const refType = useRef(null);
  const refSubject = useRef(null);
  const refSubmit = useRef(null);
  const refPlace = useRef(null);
  const refTeacher = useRef(null);
  const refGroup = useRef(null);
  const refClassGroup = useRef(null);
  const refDate = useRef(null);
  const refTime = useRef(null);
  const refEndTime = useRef(null);
  const refExperience = useRef(null);

  const [runTour, setRunTour] = useState(false);

  const steps = useMemo(
    () => [
      {
        title: "وقت تقديم العرض",
        description: "اختر الوقت المناسب للحصة: الآن أو لاحقاً.",
        target: () => refWhen.current,
        nextButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "التالي",
        },
      },
      {
        title: "نوع الحصة",
        description: "حدد إذا كانت الحصة فردية أو مجموعة.",
        target: () => refType.current,
        prevButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "السابق",
        },
        nextButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "التالي",
        },
      },
      {
        title: "المادة",
        description: "اختر المادة التي تريد المساعدة فيها.",
        target: () => refSubject.current,
        prevButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "السابق",
        },
        nextButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "التالي",
        },
      },
      {
        title: "الخبرة التعليمية",
        description: "اختر الخبرة التعليمية التي تريد المساعدة فيها.",
        target: () => refExperience.current,
        prevButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "الساق",
        },
      },
      {
        title: "طلب الحصة",
        description: "اضغط على الزر لإرسال طلب الحصة.",
        target: () => refSubmit.current,
        prevButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "السابق",
        },
        nextButtonProps: {
          style: { backgroundColor: "yellow", color: "black" },
          children: "إنهاء",
        },
      },
    ],
    []
  );

  // API calls
  const fetchUniversities = useCallback(async () => {
    try {
      const res = await axios.get(
        `${base_url}/user/uber_part/select_univerisity.php`
      );

      if (res.data.status === "success") {
        setUniversities(
          Array.isArray(res.data.message) ? res.data.message : []
        );
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const fetchGrades = useCallback(async () => {
    try {
      const res = await axios.post(
        `${base_url}/user/uber_part/select_grade.php`,
        {
          university_id: newOfferData.university_id,
        }
      );

      if (res.data.status === "success") {
        setGrades(Array.isArray(res.data.message) ? res.data.message : []);
      }
    } catch (e) {
      console.log(e);
    }
  }, [newOfferData.university_id]);

  const fetchSubjects = useCallback(async () => {
    setLoading((s) => ({ ...s, subjects: true }));

    const endPoint = `${base_url}/user/uber_part/slect_teacher_subjects_withou_stdId.php`;

    try {
      const res = await axios.post(`${endPoint}`, {
        student_id: NagahUser?.student_id,
        grade_id: NagahUser ? NagahUser?.grade_id : newOfferData?.grade_id,
        university_id: NagahUser
          ? NagahUser?.university_id
          : newOfferData?.university_id,
        teacher_id:
          newOfferData?.request_type === "immediate"
            ? "0"
            : newOfferData.teacher_id,
      });

      if (res?.data?.status === "success") {
        setSubjects(res?.data?.message);
      } else {
        toast.error(res?.data?.message || "تعذر تحميل المواد");
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء تحميل المواد");
    } finally {
      setLoading((s) => ({ ...s, subjects: false }));
    }
  }, [
    NagahUser,
    newOfferData?.grade_id,
    newOfferData?.university_id,
    newOfferData?.teacher_id,
    newOfferData?.request_type,
  ]);

  const fetchGroupsClasses = useCallback(async () => {
    try {
      const res = await axios.post(
        `${base_url}/user/uber_part/select_group_classes.php`,
        {
          group_id: newOfferData?.group_id,
        }
      );

      if (res.data.status === "success") {
        setGroupsClasses(
          Array.isArray(res.data.message) ? res.data.message : []
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [newOfferData?.group_id]);

  const fetchTeachers = useCallback(async () => {
    setLoading((s) => ({ ...s, teachers: true, experiences: true }));

    const endPoint = NagahUser
      ? `${base_url}/user/uber_part/get_available_teachers.php`
      : `${base_url}/user/uber_part/select_teacher_without_stdId.php`;

    try {
      const { data } = await axios.post(`${endPoint}`, {
        student_id: NagahUser ? NagahUser?.student_id : null,
        grade_id: NagahUser ? NagahUser?.grade_id : newOfferData?.grade_id,
        university_id: NagahUser
          ? NagahUser?.university_id
          : newOfferData?.university_id,
      });

      if (data?.status === "success") {
        // Set  with the new structure
        setExperiences(Array.isArray(data?.message) ? data.message : []);

        let allTeachers = [];
        if (Array.isArray(data?.message)) {
          data.message.forEach((exp) => {
            if (exp.teachers && Array.isArray(exp.teachers)) {
              allTeachers = [...allTeachers, ...exp.teachers];
            }
          });
        }
        setTeachers(allTeachers);
      } else {
        toast.error(data?.message || "تعذر تحميل المعلمين");
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء تحميل المعلمين");
    } finally {
      setLoading((s) => ({ ...s, teachers: false, experiences: false }));
    }
  }, [NagahUser, newOfferData?.grade_id, newOfferData?.university_id]);

  // Effects - only run after initial data is loaded
  useEffect(() => {
    if (!NagahUser && isDataLoaded) {
      fetchUniversities();
    }
  }, [NagahUser, fetchUniversities, isDataLoaded]);

  useEffect(() => {
    if (newOfferData.university_id && !NagahUser && isDataLoaded) {
      fetchGrades();
    }
  }, [newOfferData.university_id, NagahUser, fetchGrades, isDataLoaded]);

  useEffect(() => {
    if (newOfferData?.group_id && isDataLoaded) {
      fetchGroupsClasses();
    }
  }, [newOfferData?.group_id, fetchGroupsClasses, isDataLoaded]);

  useEffect(() => {
    console.log(newOfferData, "newOfferData");
  }, [newOfferData]);

  useEffect(() => {
    if (
      newOfferData?.grade_id &&
      newOfferData?.teacher_id &&
      newOfferData?.request_type &&
      isDataLoaded
    ) {
      fetchSubjects();
    }
  }, [
    newOfferData?.grade_id,
    newOfferData?.teacher_id,
    newOfferData?.request_type,
    fetchSubjects,
    isDataLoaded,
  ]);

  useEffect(() => {
    if (newOfferData?.grade_id && isDataLoaded) {
      fetchTeachers();
    }
  }, [newOfferData?.grade_id, isDataLoaded, fetchTeachers]);

  useEffect(() => {
    if (subjects.length > 0 && newOfferData?.request_type && isDataLoaded) {
      if (newOfferData?.request_type === "immediate") {
        setNewOfferData((prev) => ({
          ...prev,
          subject_id: "",
        }));
      } else {
        setNewOfferData((prev) => ({
          ...prev,
          subject_id: subjects?.[0]?.course_id ?? null,
        }));
      }
    }
  }, [subjects, newOfferData?.request_type, isDataLoaded]);

  useEffect(() => {
    if (experiences.length > 0 && newOfferData?.request_type && isDataLoaded) {
      if (newOfferData?.request_type === "immediate") {
        setNewOfferData((prev) => ({
          ...prev,
          teacher_id: "0",
          experience_id: null, // Reset experience for immediate requests
        }));
        setSelectedTeacher("0");
      } else {
        // For scheduled requests, set first experience if none selected
        if (!newOfferData.experience_id && experiences[0]?.teachers[0]) {
          setNewOfferData((prev) => ({
            ...prev,
            experience_id: experiences[0].teachers[0].experience_id,
            teacher_id:
              prev.teacher_id ?? experiences[0].teachers[0].teacher_id ?? null,
          }));
          setSelectedTeacher(
            (t) => t ?? experiences[0].teachers[0].teacher_id ?? null
          );
        }
      }
    }
  }, [experiences, newOfferData?.request_type, isDataLoaded]);

  // Form validation and submission
  const validate = () => {
    const errs = [];
    if (!newOfferData.location) errs.push("مكان الحصة مطلوب");
    if (!newOfferData.request_type) errs.push("وقت تقديم العرض مطلوب");

    if (newOfferData.request_type === "immediate") {
      if (!newOfferData.subject_id) errs.push("اختر المادة");
    } else {
      if (!newOfferData.teacher_id) errs.push("اختر المدرس");
      if (!newOfferData.subject_id) errs.push("اختر المادة");
      if (
        !newOfferData.scheduled_date &&
        newOfferData.group_type !== "individual"
      )
        errs.push("اختر تاريخ الحصة");
      if (!newOfferData.scheduled_time) errs.push("اختر وقت بداية الحصة");
      if (!newOfferData.end_time) errs.push("اختر وقت نهاية الحصة");
      if (newOfferData.group_type !== "individual" && !newOfferData.group_id) {
        errs.push("اختر المجموعة");
      }
    }

    if (errs.length) {
      toast.error(errs[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    const payload =
      newOfferData.request_type === "immediate"
        ? {
            group_id: 0,
            class_id: 0,
            student_id: newOfferData.student_id,
            teacher_id: newOfferData.teacher_id,
            subject_id: newOfferData.subject_id,
            group_type: newOfferData.group_type,
            scheduled_date: dayjs(newOfferData?.scheduled_date).format(
              "YYYY-MM-DD"
            ),
            scheduled_time: dayjs(newOfferData?.scheduled_time).format(
              "HH:mm:ss"
            ),
            end_time: dayjs(newOfferData?.end_time).format("HH:mm:ss"),
            request_type: newOfferData.request_type,
            isOnline: newOfferData.location === "online" ? 1 : 0,
          }
        : {
            student_id: newOfferData.student_id,
            teacher_id: newOfferData.teacher_id,
            group_id: newOfferData.group_id,
            class_id: newOfferData.group_classes_id,
            subject_id: newOfferData.subject_id,
            group_type: newOfferData.group_type,
            scheduled_date:
              newOfferData?.group_type === "individual"
                ? dayjs(newOfferData?.scheduled_date).format("YYYY-MM-DD")
                : newOfferData?.scheduled_date,
            scheduled_time:
              newOfferData?.group_type === "individual"
                ? dayjs(newOfferData?.scheduled_time).format("HH:mm:ss")
                : newOfferData?.scheduled_time,
            end_time:
              newOfferData?.group_type === "individual"
                ? dayjs(newOfferData?.end_time).format("HH:mm:ss")
                : newOfferData?.end_time,
            request_type: newOfferData.request_type,
            isOnline: newOfferData.location === "online" ? 1 : 0,
          };

    try {
      const { data } = await axios.post(
        `${base_url}/user/uber_part/request_class.php`,
        payload
      );
      if (data?.status === "success") {
        toast.success(data?.message || "تم إرسال الطلب بنجاح");
        localStorage.setItem("NeedOffer", JSON.stringify("NeedOffer"));
        localStorage.removeItem("newOfferData");
        navigate(`/offer-form/offers`);
      } else {
        toast.error(data?.message || "تعذر إرسال الطلب");
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  // Event handlers
  const handleLocationChange = (v) =>
    setNewOfferData((p) => ({ ...p, location: v }));

  const handleRequestTypeChange = (v) =>
    setNewOfferData((p) => ({ ...p, request_type: v }));

  const handleUniversityChange = (v) =>
    setNewOfferData((p) => ({
      ...p,
      university_id: v,
      grade_id: null,
      subject_id: null,
    }));

  const handleGradeChange = (v) =>
    setNewOfferData((p) => ({ ...p, grade_id: v, subject_id: null }));

  const handleSubjectChange = (v) =>
    setNewOfferData((p) => ({ ...p, subject_id: v }));

  const handleExperienceChange = (v) => {
    setNewOfferData((p) => ({
      ...p,
      experience_id: v,
      teacher_id: null, // Reset teacher when experience changes
      subject_id: null,
      group_id: null,
      group_classes_id: null,
      scheduled_date: null,
      scheduled_time: null,
      end_time: null,
    }));
    setSelectedTeacher(null);
  };

  const handleTeacherChange = (v) => {
    setNewOfferData((p) => ({
      ...p,
      teacher_id: v,
      subject_id: null,
      group_id: null,
      group_classes_id: null,
      scheduled_date: null,
      scheduled_time: null,
      end_time: null,
    }));
    setSelectedTeacher(v);
  };

  const handleTeacherSelect = (v) => {
    const t = teachers.find((tt) => String(tt.teacher_id) === String(v));
    setModalTeacher(t || null);
    if (t) setTeacherModalOpen(true);
  };

  const handleGroupTypeChange = (v) => {
    if (v === "individual") {
      setNewOfferData((p) => ({
        ...p,
        group_type: v,
        group_id: null,
        group_classes_id: null,
        scheduled_date: null,
        scheduled_time: null,
        end_time: null,
      }));
    } else {
      setNewOfferData((p) => ({
        ...p,
        group_type: v,
        group_id: null,
        group_classes_id: null,
      }));
    }
  };

  const handleGroupChange = (v) => {
    setNewOfferData((p) => ({
      ...p,
      group_id: v,
      group_classes_id: null,
      scheduled_date: null,
      scheduled_time: null,
      end_time: null,
    }));
  };

  const handleGroupClassChange = (v) => {
    setNewOfferData((p) => ({
      ...p,
      group_classes_id: v,
    }));
    const g = groupsClasses.find((g) => g.group_classes_id === v);
    setNewOfferData((p) => ({
      ...p,
      scheduled_date: g?.lesson_date,
      scheduled_time: g?.start_time,
      end_time: g?.end_time,
    }));
  };

  const handleDateChange = (d) =>
    setNewOfferData((p) => ({ ...p, scheduled_date: d }));

  const handleStartTimeChange = (t) =>
    setNewOfferData((p) => ({ ...p, scheduled_time: t }));

  const handleEndTimeChange = (t) =>
    setNewOfferData((p) => ({ ...p, end_time: t }));

  // Don't render the page until initial data is loaded
  if (!isDataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <>
      <TourGuide
        open={runTour}
        onClose={() => setRunTour(false)}
        steps={steps}
      />

      <TeacherModal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        teacher={modalTeacher}
        subjects={subjects}
      />

      <div className="group w-[95%]  sm:w-[80%] mx-auto my-[50px]">
        <div
          className="relative sm:border-[3px] sm:border-[transparent] rounded-2xl transition-all duration-500 hover:shadow-2xl"
          style={{
            background:
              "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
            // border: "3px solid transparent",
            minHeight: "270px",
          }}
        >
          <div className="relative z-10 flex flex-col justify-center items-center p-1 sm:p-8 h-full">
            <FormHeader title="طلب حصه" />

            <div className="text-white text-end space-y-4 w-full">
              <div className="w-[90%] m-auto flex flex-col gap-[10px]">
                <LocationSelector
                  value={newOfferData.location}
                  onChange={handleLocationChange}
                  refPlace={refPlace}
                />

                <RequestTypeSelector
                  value={newOfferData.request_type}
                  onChange={handleRequestTypeChange}
                  refWhen={refWhen}
                />

                {/* when user is not logged in */}
                {!NagahUser && (
                  <UserInfoForm
                    universityId={newOfferData.university_id}
                    gradeId={newOfferData.grade_id}
                    universities={universities}
                    grades={grades}
                    onUniversityChange={handleUniversityChange}
                    onGradeChange={handleGradeChange}
                  />
                )}

                {newOfferData.request_type === "immediate" ? (
                  <ImmediateRequestForm
                    subjectId={newOfferData.subject_id}
                    onSubjectChange={handleSubjectChange}
                    refSubject={refSubject}
                    subjectOptions={subjectOptions}
                    loading={loading.subjects}
                  />
                ) : (
                  <ScheduledRequestForm
                    newOfferData={newOfferData}
                    onExperienceChange={handleExperienceChange} // Add this handler
                    onGroupTypeChange={handleGroupTypeChange}
                    onTeacherChange={handleTeacherChange}
                    onSubjectChange={handleSubjectChange}
                    onGroupChange={handleGroupChange}
                    onGroupClassChange={handleGroupClassChange}
                    onDateChange={handleDateChange}
                    onStartTimeChange={handleStartTimeChange}
                    onEndTimeChange={handleEndTimeChange}
                    onTeacherSelect={handleTeacherSelect}
                    subjectOptions={subjectOptions}
                    experienceOptions={experienceOptions} // Add this
                    refType={refType}
                    refExperience={refExperience} // Make sure this ref exists
                    refTeacher={refTeacher}
                    refSubject={refSubject}
                    refGroup={refGroup}
                    refClassGroup={refClassGroup}
                    refDate={refDate}
                    refTime={refTime}
                    refEndTime={refEndTime}
                    lessonTypeOptions={lessonTypeOptions}
                    teacherOptions={teacherOptions}
                    teacherObj={teacherObj}
                    groupsClasses={groupsClasses}
                    days={days}
                    loadingTeachers={loading.teachers}
                    loadingExperiences={loading.experiences}
                  />
                )}

                <SubmitButton
                  onClick={NagahUser ? handleSubmit : openSignModal}
                  submitting={submitting}
                  refSubmit={refSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <SignInModal
        openSignInModal={openSignInModal}
        setOpenSignInModal={setOpenSignInModal}
        newOfferData={newOfferData}
      />
    </>
  );
};

export default OfferForm;
