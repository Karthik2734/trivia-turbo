import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database, Cpu, Brain, Bug, Code, ArrowLeft } from "lucide-react";

type CategoryId = "os" | "dbms" | "ai" | "testing" | "dsa";

const categoryData: Array<{
  id: CategoryId;
  name: string;
  icon: any;
  color: string;
  desc: string;
}> = [
  { id: "os" as const, name: "Operating Systems", icon: Cpu, color: "text-primary", desc: "Test your OS knowledge" },
  { id: "dbms" as const, name: "Database Management", icon: Database, color: "text-secondary", desc: "Master DBMS concepts" },
  { id: "ai" as const, name: "Artificial Intelligence", icon: Brain, color: "text-accent", desc: "AI fundamentals" },
  { id: "testing" as const, name: "Software Testing", icon: Bug, color: "text-warning", desc: "Quality assurance" },
  { id: "dsa" as const, name: "Data Structures & Algorithms", icon: Code, color: "text-success", desc: "DSA mastery" },
];

const Categories = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const toggleCategory = (categoryId: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const startQuiz = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    navigate("/quiz", { state: { categories: selectedCategories } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Select Quiz Categories</h1>
            <p className="text-lg text-muted-foreground">
              Choose one or more categories to test your knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categoryData.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <CardHeader>
                    <Icon className={`w-12 h-12 ${category.color} mb-2`} />
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">100 questions</span>
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id);
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={startQuiz}
              disabled={selectedCategories.length === 0}
              className="text-lg px-12"
            >
              Start Quiz ({selectedCategories.length} {selectedCategories.length === 1 ? "category" : "categories"})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
