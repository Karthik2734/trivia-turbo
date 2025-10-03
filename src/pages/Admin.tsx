import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit, ArrowLeft } from "lucide-react";

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

const Admin = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    category: "os" | "dbms" | "ai" | "testing" | "dsa";
  }>({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    category: "os",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        toast.error("Admin access required");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchQuestions();
    } catch (error) {
      console.error("Admin check failed:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch questions");
      return;
    }

    setQuestions(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("questions")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Question updated!");
        setEditingId(null);
      } else {
        const { error } = await supabase.from("questions").insert(formData);

        if (error) throw error;
        toast.success("Question added!");
      }

      setFormData({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        category: "os",
      });

      fetchQuestions();
    } catch (error: any) {
      toast.error(error.message || "Failed to save question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete question");
      return;
    }

    toast.success("Question deleted!");
    fetchQuestions();
  };

  const handleEdit = (question: Question) => {
    setFormData({
      question: question.question,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      category: question.category as "os" | "dbms" | "ai" | "testing" | "dsa",
    });
    setEditingId(question.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Question" : "Add New Question"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as "os" | "dbms" | "ai" | "testing" | "dsa" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="os">Operating Systems</SelectItem>
                      <SelectItem value="dbms">Database Management</SelectItem>
                      <SelectItem value="ai">Artificial Intelligence</SelectItem>
                      <SelectItem value="testing">Software Testing</SelectItem>
                      <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="option_a">Option A</Label>
                    <Input
                      id="option_a"
                      value={formData.option_a}
                      onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_b">Option B</Label>
                    <Input
                      id="option_b"
                      value={formData.option_b}
                      onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_c">Option C</Label>
                    <Input
                      id="option_c"
                      value={formData.option_c}
                      onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_d">Option D</Label>
                    <Input
                      id="option_d"
                      value={formData.option_d}
                      onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correct_answer">Correct Answer</Label>
                  <Select
                    value={formData.correct_answer}
                    onValueChange={(value) => setFormData({ ...formData, correct_answer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    {editingId ? "Update Question" : "Add Question"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          question: "",
                          option_a: "",
                          option_b: "",
                          option_c: "",
                          option_d: "",
                          correct_answer: "A",
                          category: "os",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{q.question}</div>
                        <div className="text-sm text-muted-foreground">
                          Category: {q.category.toUpperCase()} | Correct: {q.correct_answer}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(q)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
