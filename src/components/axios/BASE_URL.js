export const BASE_URL = "https://camp-coding.online/Teacher_App_2025/Nagah_kw";
export const BASES_ROUTES = {
  admin: "admin/",
  user: "user/",
};
export const API_ROUTES = {
  auth: "admin_users/login.php",
  image: "image_uplouder.php",
  pdfs: "uploud_pdf.php",
  student: {
    BASE_ROUTE: "students/",
    ROUTES: {
      add: "create_student_account.php",
      select: "select_students.php",
      select_student_subjects: "select_student_subjects.php",
      update_student_group: "update_student_group.php",
      assign_subject_to_student: "assign_subject_to_student.php",
      renew_student_subscription: "renew_student_subscription.php",
      // select_groups
    },
  },
  subscription: {
    BASE_ROUTE: "subscriptions/",
    ROUTES: {
      renew_student_subscription: "renew_student_subscription.php",
      subscription_history: "select_student_subject_subscriptions.php",
    },
  },
  // subscriptions
  user: {
    BASE_ROUTE: "admin_users/",
    ROUTES: {
      add: "select_admin_users.php",
      select: "select_admin_users.php",
    },
  },
  course: {
    BASE_ROUTE: "subjects/",
    ROUTES: {
      add: "add_subject.php",
      select: "select_subjects.php",
      select_groups: "select_group_students.php",
      select_SUBJECT: "select_subject_students.php",
    },
  },
  group: {
    BASE_ROUTE: "subjects/",
    ROUTES: {
      add: "add_group.php",
      select: "select_groups.php",
      update: "edit_group.php",
    },
  },
  pdf: {
    BASE_ROUTE: "pdf/",
    ROUTES: {
      add: "add_pdf.php",
      update: "update_pdf.php",
      select: "select_pdfs.php",
      selectBySubject: "select_pdf_groups.php",
      show_hide_group_pdf: "show_hide_group_pdf.php",
      select_group_pdfs: "select_group_pdfs.php",
    },
  },
  meetings: {
    BASE_ROUTE: "meeting/",
    ROUTES: {
      add: "create_meeting.php",
      update: "update_pdf.php",
      select: "select_meetings.php",
      selectByLives: "select_meeting_groups.php",
      finishMeeting: "/finished_meeting.php",
      show_hide_group: "show_meeting_group.php",
    },
  },
  chains: {
    BASE_ROUTE: "chains/",
    ROUTES: {
      add: "add_chain.php",
      select: "select_chains.php",
      update: "update_chain.php",
    },
  },
  videos: {
    BASE_ROUTE: "videos/",
    ROUTES: {
      add: "add_video.php",
      select: "select_videos.php",
      update: "update_video.php",
      select_video_groups: "select_video_groups.php",
      show_hide_group_videos: "show_hide_group_videos.php",
      select_group_videos: "select_group_videos.php",
    },
  },
  exam: {
    BASE_ROUTE: "exams/",
    ROUTES: {
      add: "add_exam.php",
      update: "update_pdf.php",
      select: "select_exams.php",
      selectBySubject: "select_exams_groups.php",
      show_hide_group_pdf: "show_hide_group_exam.php",
      select_group_pdfs: "select_group_exams.php",
      addQuestion: "add_ques.php",
      updateQuestion: "edit_ques.php",
      select_questions: "select_exam_qustions.php",
    },
  },
};
