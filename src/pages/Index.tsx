import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FormWelcome } from "@/components/FormWelcome";
import { FormQuestionWithValidation } from "@/components/FormQuestionWithValidation";
import { FormComplete } from "@/components/FormComplete";
import { useToast } from "@/hooks/use-toast";
import { formSchema, type FormData } from "@/lib/formSchema";

interface Question {
  id: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date";
  title: string;
  subtitle?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: "fullName",
    type: "text",
    title: "1. Full Name",
    subtitle: "Full Name",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    id: "emailAddress",
    type: "email",
    title: "2. Email Address",
    subtitle: "Email Address",
    required: true,
    placeholder: "Enter your email",
  },
  {
    id: "mobileNumber",
    type: "tel",
    title: "3. Mobile Number",
    subtitle: "Mobile Number",
    required: true,
    placeholder: "Enter your mobile number",
  },
  {
    id: "occupation",
    type: "select",
    title: "4. Occupation",
    subtitle: "Occupation",
    required: true,
    options: [
      "Student",
      "Housewife",
      "Working Professional",
      "Business Owner",
      "Other",
    ],
  },
  {
    id: "goalForWebinar",
    type: "select",
    title: "5. Your Goal for Attending the Webinar",
    subtitle: "Webinar Goal",
    required: true,
    options: [
      "Learn Digital Marketing",
      "Start a Business",
      "Improve My Career",
      "Grow My Existing Business",
    ],
  },
  // {
  //   id: "heardAboutWebinar",
  //   type: "select",
  //   title: "6. How Did You Hear About This Webinar?",
  //   subtitle: "Source",
  //   required: true,
  //   options: [
  //     "Instagram",
  //     "Facebook",
  //     "Through Delta Counsellor",
  //     "Other",
  //   ],
  // },
];


const Index = () => {
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "questions" | "complete"
  >(
    localStorage.getItem("currentStep")
      ? (localStorage.getItem("currentStep") as
          | "welcome"
          | "questions"
          | "complete")
      : "welcome"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    localStorage.getItem("currentQuestionIndex")
      ? parseInt(localStorage.getItem("currentQuestionIndex") || "0")
      : 0
  );

  const [answers, setAnswers] = useState<Record<string, string>>(
    localStorage.getItem("answers")
      ? JSON.parse(localStorage.getItem("answers") || "{}")
      : {}
  );

  const [direction, setDirection] = useState<"left" | "right">("right");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem(
      "currentQuestionIndex",
      currentQuestionIndex.toString()
    );
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [currentStep, currentQuestionIndex, answers]);

  const handleStart = () => {
    setCurrentStep("questions");
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    // Basic validation for empty required fields
    console.log(currentQuestion.required, answer, "🟢");
    if (currentQuestion.required && (!answer || answer.trim() === "")) {
     
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setDirection("left");
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Validate entire form before submission
      try {
        setCurrentStep("complete");
      } catch (error) {
        toast({
          title: "Validation Error",
          description: "Please check all fields and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection("right");
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const [ip, setIp] = useState("");
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === "select") {
      handleNext();
    }
  }, [answers]);
  // useEffect(() => {
  //   const fetchIpAndLocation = async () => {
  //     try {
  //       const res = await fetch("https://ipapi.co/json/");
  //       const data = await res.json();
  //       console.log(data, "🟢");
  //       setIp(data.ip);
  //       setLocationData({
  //         city: data.city,
  //         region: data.region,
  //         country: data.country_name,
  //         latitude: data.latitude,
  //         longitude: data.longitude,
  //         timezone: data.timezone,
  //       });
  //     } catch (error) {
  //       console.log("Location fetch error:", error);
  //     }
  //   };

  //   fetchIpAndLocation();
  // }, []);

  const [loading, setLoading] = useState(false);

  const url =
    "https://script.google.com/macros/s/AKfycbyNbrlSXvaZjhIzUiEN4qfKDNnL5fbjdRdL3KESmylTCVejTvQDjQG9KpGtIRFYQ2i-Og/exec";
  const handleSubmit = async () => {
    setLoading(true);

    try {
      await fetch(url, {
        method: "POST",
     
        body: JSON.stringify({
          FullName: answers.fullName,
          Email: answers.emailAddress,
          PhoneNumber: answers.mobileNumber,
          Occupation: answers.occupation,
          GoalForWebinar: answers.goalForWebinar,
          HeardAboutWebinar:"",
         
        }),
      });
     
      toast({
        title: "Application Submitted Successfully!",
        description:
          "Thank you for your response. We will contact you soon. Let’s begin our learning journey from here!",
      });
      setAnswers({});
    } catch (error) {
      console.error(error);
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRestart = async () => {
    await handleSubmit();
    setCurrentStep("welcome");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";
  const canGoNext = currentQuestion
    ? !currentQuestion.required ||
      (currentAnswer && currentAnswer.trim() !== "")
    : false;

  if (currentStep === "welcome") {
    return <FormWelcome onStart={handleStart} />;
  }

  if (currentStep === "complete") {
    return <FormComplete loading={loading} onRestart={handleRestart} />;
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <FormQuestionWithValidation
        key={currentQuestionIndex}
        question={currentQuestion as any}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        value={currentAnswer}
        onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === questions.length - 1}
        allAnswers={answers}
        direction={direction}
      />
    </AnimatePresence>
  );
};

export default Index;
