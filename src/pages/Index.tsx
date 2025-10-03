import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Trophy, Users, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Trivia Turbo
            </h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <>
                <Button variant="outline" onClick={() => navigate("/categories")}>
                  Start Quiz
                </Button>
                <Button variant="outline" onClick={() => navigate("/leaderboard")}>
                  Leaderboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>Get Started</Button>
            )}
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Test Your Knowledge
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Beat the Clock
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Challenge yourself with timed quizzes across 5 categories. 15 seconds per question. Can you reach the top?
          </p>
          {!user && (
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Start Your Journey
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast-Paced</h3>
            <p className="text-muted-foreground">15-second timer keeps you on your toes</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <Brain className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">5 Categories</h3>
            <p className="text-muted-foreground">OS, DBMS, AI, Testing & DSA</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <Trophy className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <p className="text-muted-foreground">Compete for the top spot</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <Users className="w-12 h-12 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">View your scores and improve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
