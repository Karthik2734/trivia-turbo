import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award, ArrowLeft } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  total_score: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar, total_score")
        .order("total_score", { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-warning" />;
    if (index === 1) return <Medal className="w-8 h-8 text-muted-foreground" />;
    if (index === 2) return <Award className="w-8 h-8 text-accent" />;
    return <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-lg text-muted-foreground">Top performers of all time</p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </CardContent>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No scores yet. Be the first to play!</p>
                <Button onClick={() => navigate("/categories")} className="mt-4">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <Card
                  key={entry.id}
                  className={`transition-all hover:shadow-lg ${
                    index === 0 ? "border-warning shadow-lg" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-shrink-0 text-4xl">{entry.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{entry.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.total_score} points
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {entry.total_score}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
