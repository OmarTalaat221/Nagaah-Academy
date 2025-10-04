import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  BookOpen,
  Eye,
  EyeOff,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../constants";
import { useSearchParams } from "react-router-dom";
import SolvedExamView from "./SolvedExamView";
import UnsolvedExamView from "./UnsolvedExamView";

const mockSolvedQuestions = [
  {
    question_text: "ما هي عاصمة مصر؟",
    user_answer: "القاهرة",
    question_valid_answer: "القاهرة",
    is_correct: true,
    real_answers: [
      {
        answer_text: "القاهرة",
        answer_check: true,
        answer_exp:
          "القاهرة هي العاصمة الإدارية والاقتصادية لجمهورية مصر العربية.",
      },
      {
        answer_text: "الإسكندرية",
        answer_check: false,
        answer_exp: "الإسكندرية مدينة ساحلية لكنها ليست العاصمة.",
      },
      {
        answer_text: "الأقصر",
        answer_check: false,
        answer_exp: "الأقصر مدينة أثرية جنوب مصر وليست العاصمة.",
      },
    ],
  },
  {
    question_text: "ما هو ناتج 5 × 6؟",
    user_answer: "30",
    question_valid_answer: "30",
    is_correct: true,
    real_answers: [
      {
        answer_text: "25",
        answer_check: false,
        answer_exp: "",
      },
      {
        answer_text: "30",
        answer_check: true,
        answer_exp: "5 * 6 = 30",
      },
    ],
  },
];

export default function ModernQuiz({ data }) {
  const [params] = useSearchParams();
  const checkParam = params.get("status");
  const isSolvedMode = checkParam === "solved";

  const navigate = useNavigate();
  const { id } = useParams();
  const UserData = JSON.parse(localStorage.getItem("NagahUser"));

  // Common State
  const [questionIndex, setQuestionIndex] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanations, setShowExplanations] = useState(true);
  const [loading, setLoading] = useState(true);

  // Unsolved State
  const [answers, setAnswers] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [correctAnsIndex, setCorrectAnsIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    if (isSolvedMode) {
      const fetchSolvedQuestions = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 500));
        setQuestions(mockSolvedQuestions);
        setLoading(false);
      };
      fetchSolvedQuestions();
    } else {
      setAnswers(Array(data.length).fill(null));
      setSubmittedAnswers(Array(data.length).fill(false));
    }
  }, [isSolvedMode, data]);

  if (isSolvedMode) {
    return (
      <SolvedExamView
        mockSolvedQuestions={mockSolvedQuestions}
        loading={loading}
      />
    );
  } else {
    return (
      <UnsolvedExamView
        data={data}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        answers={answers}
        setAnswers={setAnswers}
        submittedAnswers={submittedAnswers}
        setSubmittedAnswers={setSubmittedAnswers}
        correctAnsIndex={correctAnsIndex}
        setCorrectAnsIndex={setCorrectAnsIndex}
        showResults={showResults}
        setShowResults={setShowResults}
        quizAnswers={quizAnswers}
        setQuizAnswers={setQuizAnswers}
        navigate={navigate}
        UserData={UserData}
        id={id}
      />
    );
  }
}
