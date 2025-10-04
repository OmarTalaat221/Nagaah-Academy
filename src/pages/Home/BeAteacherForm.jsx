import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../constants";
import { Modal } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

// Import Components
import SubjectSelectionSection from "./components/SubjectSelectionSection";
import PersonalInfoSection from "./components/PersonalInfoSection";
import SecuritySection from "./components/SecuritySection";
import FileUploadsSection from "./components/FileUploadsSection";
import SubmitButton from "./components/SubmitButton";
import FormHeader from "./components/FormHeader";

const BeAteacherForm = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    message: "",
    isSuccess: false,
  });

  // Error states for each section
  const [hasPersonalInfoError, setHasPersonalInfoError] = useState(false);
  const [hasSecurityError, setHasSecurityError] = useState(false);
  const [hasSubjectError, setHasSubjectError] = useState(false);
  const [hasTermsError, setHasTermsError] = useState(false);

  // Terms and conditions checkbox state
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    teacher_name: "",
    teacher_email: "",
    teacher_password: "",
    teacher_role: "",
    teacher_description: null,
    teacher_img: null,
    intro_vid_url: null,
    teacher_cv: null,
    teacher_phone: "",
    teacher_summary: "",
    gender: "",
    educational_stage: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [currentUniversity, setCurrentUniversity] = useState(0);
  const [expericence, setExperiences] = useState([]);

  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentGrade, setCurrentGrade] = useState(0);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [showSubjectSelect, setShowSubjectSelect] = useState("university");

  // Dropdown options
  const genderOptions = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
  ];

  const getGradesUniv = useCallback(async () => {
    try {
      const res = await axios.post(
        `${base_url}/admin/universities/select_all_grades.php`,
        {
          university_id: currentUniversity,
        }
      );

      if (res.data.status === "success") {
        setGrades(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUniversity]);

  const getGradesAndSubjects = useCallback(async () => {
    try {
      const res = await axios.get(
        `${base_url}/admin/courses/select_all_courses.php?university_id=${currentUniversity}&grade_id=${currentGrade}`
      );

      if (res.data.status === "success") {
        setSubjects(res.data.message || []);
      }
    } catch (error) {
      console.error("Error fetching grades and subjects:", error);
      toast.error("حدث خطأ في جلب البيانات");
    }
  }, [currentUniversity, currentGrade]);

  const getExperienceOptions = useCallback(async () => {
    try {
      const res = await axios.get(
        `${base_url}/user/teachers/get_experience.php `
      );

      if (res.data.status === "success") {
        setExperiences(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Get grades and subjects
  useEffect(() => {
    getUniversity();
  }, []);

  useEffect(() => {
    if (currentUniversity) {
      getGradesUniv();
    }
  }, [currentUniversity, getGradesUniv]);

  useEffect(() => {
    if (currentUniversity && currentGrade) {
      getGradesAndSubjects();
    }
  }, [currentUniversity, currentGrade, getGradesAndSubjects]);

  useEffect(() => {
    getExperienceOptions();
  }, [getExperienceOptions]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "teacher_img" && file) {
        setPreviewImg(URL.createObjectURL(file));
      }

      if (name === "intro_vid_url" && file) {
        setPreviewVideo(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Validation functions
  const validatePersonalInfo = () => {
    const newErrors = {};

    if (!formData.teacher_name.trim()) {
      newErrors.teacher_name = "الاسم الكامل مطلوب";
    }

    if (!formData.teacher_email.trim()) {
      newErrors.teacher_email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.teacher_email)) {
      newErrors.teacher_email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.teacher_phone.trim()) {
      newErrors.teacher_phone = "رقم الهاتف مطلوب";
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.teacher_phone)) {
      newErrors.teacher_phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.teacher_summary.trim()) {
      newErrors.teacher_summary = "الملخص الشخصي مطلوب";
    }

    if (!formData.teacher_role.trim()) {
      newErrors.teacher_role = "الاختصاص الأساسي مطلوب";
    }

    if (!formData.gender) {
      newErrors.gender = "يرجى اختيار النوع";
    }

    if (!formData.experience_id) {
      newErrors.experience_id = "يرجى اختيار مستوى الخبرة";
    }

    return newErrors;
  };

  const validateSecurity = () => {
    const newErrors = {};

    if (!formData.teacher_password.trim()) {
      newErrors.teacher_password = "كلمة المرور مطلوبة";
    }
    return newErrors;
  };

  const getUniversity = async () => {
    try {
      const res = await axios.get(
        `${base_url}/admin/universities/select_all_univ.php`
      );

      if (res.data.status === "success") {
        setUniversities(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to open PDF
  const openTermsPDF = () => {
    // Replace this URL with your actual PDF URL
    const pdfUrl = `https://camp-coding.online/Teacher_App_2025/Nagah_kw/admin/pdfs/pdf_1758451124_5735.pdf`;
    window.open(pdfUrl, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug logging
    console.log("Accept terms value:", acceptTerms);
    console.log("Selected subjects:", selectedSubjects);
    console.log("Form data:", formData);

    // Reset all error states first
    setHasSubjectError(false);
    setHasPersonalInfoError(false);
    setHasSecurityError(false);
    setHasTermsError(false);
    setErrors({});

    let validationErrors = [];

    // Validate terms acceptance
    if (!acceptTerms) {
      setHasTermsError(true);
      validationErrors.push("يرجى الموافقة على الشروط والأحكام");
    }

    // Validate subject selection
    if (selectedSubjects.length === 0) {
      setHasSubjectError(true);
      validationErrors.push("يرجى اختيار مادة واحدة على الأقل");
    }

    // Validate personal info
    const personalInfoErrors = validatePersonalInfo();
    if (Object.keys(personalInfoErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...personalInfoErrors }));
      setHasPersonalInfoError(true);
      validationErrors.push("يرجى تصحيح الأخطاء في المعلومات الشخصية");
    }

    // Validate security
    const securityErrors = validateSecurity();
    if (Object.keys(securityErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...securityErrors }));
      setHasSecurityError(true);
      validationErrors.push("يرجى تصحيح الأخطاء في معلومات الأمان");
    }

    // If there are any validation errors, show them and stop
    if (validationErrors.length > 0) {
      // Show the first error
      toast.error(validationErrors[0]);
      return;
    }

    // If we reach here, all validations passed
    console.log("All validations passed, proceeding with submission...");
    setLoading(true);

    try {
      // Handle image upload
      let imageUrl = "";
      if (formData.teacher_img) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.teacher_img);
        const imageRes = await axios.post(
          `${base_url}/admin/image_uploader.php`,
          formDataImg
        );
        imageUrl = imageRes.data;
      }

      // Handle video upload
      let videoUrl = "";
      if (formData.intro_vid_url) {
        const formDataVideo = new FormData();
        formDataVideo.append("video_file", formData.intro_vid_url);
        const videoRes = await axios.post(
          `${base_url}/admin/video_uploader.php`,
          formDataVideo
        );
        videoUrl = videoRes.data.video_url;
      }

      // Handle PDF upload
      let pdfUrl = "";
      if (formData.teacher_cv) {
        const formDataPdf = new FormData();
        formDataPdf.append("pdf_file", formData.teacher_cv);
        const pdfRes = await axios.post(
          `${base_url}/admin/pdf_uploader.php`,
          formDataPdf
        );
        pdfUrl = pdfRes.data.pdf_url;
      }

      const dataSend = {
        teacher_name: formData.teacher_name,
        teacher_email: formData.teacher_email,
        teacher_password: formData.teacher_password,
        teacher_role: formData.teacher_role,
        teacher_description: formData.teacher_summary,
        teacher_img: imageUrl,
        intro_vid_url: videoUrl,
        teacher_phone: formData.teacher_phone,
        teacher_cv: pdfUrl,
        experience_id: formData.experience_id,
        teacher_courses: selectedSubjects
          .map((item) => item.subjectId)
          .join(","),
      };

      const response = await axios.post(
        `${base_url}/user/teachers/add_teacher.php`,
        dataSend
      );

      if (response.data.status === "success") {
        // Show success modal
        setModalContent({
          message: "تم ارسال طلبك",
          isSuccess: true,
        });
        setModalVisible(true);

        // Reset form
        setFormData({
          teacher_name: "",
          teacher_email: "",
          teacher_password: "",
          teacher_role: "",
          teacher_description: null,
          teacher_img: null,
          intro_vid_url: null,
          teacher_summary: "",
          teacher_phone: "",
          teacher_cv: null,
          gender: "",
          educational_stage: "",
        });
        setSelectedSubjects([]);
        setPreviewImg(null);
        setPreviewVideo(null);
        setShowSubjectSelect("university");
        setCurrentUniversity(0);
        setCurrentGrade(0);
        setCurrentSubject(0);
        setHasSubjectError(false);
        setHasPersonalInfoError(false);
        setHasSecurityError(false);
        setAcceptTerms(false);
        setHasTermsError(false);
      } else {
        // Show error modal
        setModalContent({
          message: response.data?.message || "عذرا حدث خطأ جرب في وقت لاحق",
          isSuccess: false,
        });
        setModalVisible(true);
        setErrors(response.data.message || {});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error modal
      setModalContent({
        message: "عذرا حدث خطأ جرب في وقت لاحق",
        isSuccess: false,
      });
      setModalVisible(true);
      setErrors({ general: "حدث خطأ أثناء إرسال النموذج" });
    } finally {
      setLoading(false);
    }
  };

  const experienceOptions = expericence.map((item) => ({
    value: item.experience_id,
    label: item.experience,
  }));

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #3b003b 0%, #5a0a5a 50%, #3b003b 100%)`,
      }}
    >
      {/* Response Modal */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        closable
        width={400}
      >
        <div className="text-center py-6">
          {modalContent.isSuccess ? (
            <CheckCircleFilled
              style={{
                fontSize: "60px",
                color: "#52c41a",
                marginBottom: "16px",
              }}
            />
          ) : (
            <CloseCircleFilled
              style={{
                fontSize: "60px",
                color: "#ff4d4f",
                marginBottom: "16px",
              }}
            />
          )}
          <h2 className="text-xl font-bold mb-2">{modalContent.message}</h2>
          <p className="text-gray-600">
            {modalContent.isSuccess
              ? "سيتم مراجعة طلبك في أقرب وقت"
              : "يرجى المحاولة مرة أخرى في وقت لاحق"}
          </p>
        </div>
      </Modal>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{ background: "#ffd700", top: "10%", left: "10%" }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-10"
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ bottom: "10%", right: "10%", background: "#ffd700" }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "50%", left: "80%", background: "#ffd700" }}
        />
      </div>

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Card */}
        <div
          className="backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-opacity-20"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderColor: "#ffd700",
            boxShadow: `0 25px 50px -12px rgba(59, 0, 59, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.2)`,
          }}
        >
          {/* Header */}
          <FormHeader />

          {/* Form */}
          <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
              <SubjectSelectionSection
                universities={universities}
                grades={grades}
                subjects={subjects}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}
                currentUniversity={currentUniversity}
                setCurrentUniversity={setCurrentUniversity}
                currentGrade={currentGrade}
                setCurrentGrade={setCurrentGrade}
                currentSubject={currentSubject}
                setCurrentSubject={setCurrentSubject}
                showSubjectSelect={showSubjectSelect}
                setShowSubjectSelect={setShowSubjectSelect}
                hasError={hasSubjectError}
                setHasError={setHasSubjectError}
              />

              {/* Personal Information Section */}
              <PersonalInfoSection
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                setErrors={setErrors}
                genderOptions={genderOptions}
                experienceOptions={experienceOptions}
                hasError={hasPersonalInfoError}
                setHasError={setHasPersonalInfoError}
              />

              {/* Security Section */}
              <SecuritySection
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                setErrors={setErrors}
                hasError={hasSecurityError}
                setHasError={setHasSecurityError}
              />

              {/* File Uploads Section */}
              <FileUploadsSection
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                previewImg={previewImg}
                previewVideo={previewVideo}
              />

              {/* Terms and Conditions Section */}
              <motion.div
                className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 transition-all duration-300 ${
                  hasTermsError
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      id="accept-terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        console.log("Checkbox changed:", e.target.checked);
                        setAcceptTerms(e.target.checked);
                        if (e.target.checked) {
                          setHasTermsError(false);
                        }
                      }}
                      className={`w-5 h-5 rounded border-2 focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        hasTermsError
                          ? "border-red-400 text-red-600 focus:ring-red-300"
                          : "border-gray-300 text-purple-600 focus:ring-purple-300"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="accept-terms"
                      className={`text-sm leading-relaxed cursor-pointer ${
                        hasTermsError ? "text-red-700" : "text-gray-700"
                      }`}
                    >
                      أوافق على{" "}
                      <button
                        type="button"
                        onClick={openTermsPDF}
                        className="text-purple-600 hover:text-purple-800 underline font-medium transition-colors duration-200 hover:bg-purple-50 px-1 py-0.5 rounded"
                      >
                        الشروط والأحكام
                      </button>{" "}
                      الخاصة بالموقع وأتعهد بالالتزام بها
                    </label>
                  </div>
                </div>

                {hasTermsError && (
                  <motion.div
                    className="mt-3 flex items-center space-x-2 space-x-reverse"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-red-600 text-sm font-medium">
                      يجب الموافقة على الشروط والأحكام للمتابعة
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Submit Button */}
              <SubmitButton loading={loading} />

              {/* Error Display */}
              {errors.general && (
                <motion.div
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-600 text-center">{errors.general}</p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-60"
          style={{ background: "#ffd700" }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-60"
          style={{ background: "#3b003b" }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
};

export default BeAteacherForm;
