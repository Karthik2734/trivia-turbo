import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RotateCcw, Home, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };

  const percentage = (score / total) * 100;

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [percentage]);

  const getGrade = () => {
    if (percentage >= 90) return { grade: "A+", color: "text-success", message: "Outstanding!" };
    if (percentage >= 80) return { grade: "A", color: "text-success", message: "Excellent!" };
    if (percentage >= 70) return { grade: "B", color: "text-secondary", message: "Great job!" };
    if (percentage >= 60) return { grade: "C", color: "text-warning", message: "Good effort!" };
    return { grade: "D", color: "text-destructive", message: "Keep practicing!" };
  };

  const gradeInfo = getGrade();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Trophy className={`w-20 h-20 ${gradeInfo.color}`} />
          </div>
          <CardTitle className="text-4xl mb-2">Quiz Complete!</CardTitle>
          <p className="text-xl text-muted-foreground">{gradeInfo.message}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-6xl font-bold">{score}</span>
              <span className="text-4xl text-muted-foreground">/ {total}</span>
            </div>
            <div className={`text-5xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
            <div className="text-2xl font-semibold">{percentage.toFixed(1)}%</div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-y">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{total - score}</div>
              <div className="text-sm text-muted-foreground">Wrong</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="grid gap-3">
            <Button size="lg" onClick={() => navigate("/categories")} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/leaderboard")} className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Leaderboard
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/")} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
