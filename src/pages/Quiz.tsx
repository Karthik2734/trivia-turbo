import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Timer, Clock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  category: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categories = location.state?.categories as ("os" | "dbms" | "ai" | "testing" | "dsa")[];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      navigate("/categories");
      return;
    }

    fetchQuestions();
  }, [categories, navigate]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .in("category", categories)
        .limit(20);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("No questions available for selected categories");
        navigate("/categories");
        return;
      }

      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to load questions");
      navigate("/categories");
    }
  };

  useEffect(() => {
    if (loading || selectedAnswer) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, loading, selectedAnswer]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];

    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
      toast.success("Correct!");
    } else {
      toast.error(`Wrong! Correct answer: ${currentQuestion.correct_answer}`);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
    } else {
      await saveQuizAttempt();
      navigate("/results", { state: { score, total: questions.length } });
    }
  };

  const saveQuizAttempt = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("total_score")
        .eq("id", session.user.id)
        .single();

      const newTotalScore = (profileData?.total_score || 0) + score;

      await supabase.from("quiz_attempts").insert({
        user_id: session.user.id,
        category: categories[0],
        score,
        total_questions: questions.length,
      });

      await supabase
        .from("profiles")
        .update({ total_score: newTotalScore })
        .eq("id", session.user.id);
    } catch (error) {
      console.error("Failed to save quiz attempt:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timerColor = timeLeft > 10 ? "text-success" : timeLeft > 5 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className={`flex items-center gap-2 text-2xl font-bold ${timerColor}`}>
              <Clock className="w-6 h-6" />
              {timeLeft}s
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>
            <div className="grid gap-4">
              {["A", "B", "C", "D"].map((option) => {
                const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
                const isSelected = selectedAnswer === option;
                const isCorrect = currentQuestion.correct_answer === option;
                const showResult = selectedAnswer !== null;

                let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += "border-success bg-success/10 text-success-foreground";
                  } else if (isSelected) {
                    buttonClass += "border-destructive bg-destructive/10 text-destructive-foreground";
                  } else {
                    buttonClass += "border-border";
                  }
                } else {
                  buttonClass += "border-border hover:border-primary hover:bg-primary/5";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <span className="font-bold mr-3">{option}.</span>
                    {optionText}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>Score: {score}</div>
          <div>Category: {currentQuestion.category.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
