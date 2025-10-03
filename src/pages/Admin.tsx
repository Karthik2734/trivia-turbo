import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    category: "",
    correct_answer: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Dummy Question Added!\n\n" + JSON.stringify(formData, null, 2));
    setFormData({
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      category: "",
      correct_answer: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                {/* Question */}
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    required
                    rows={3}
                  />
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="option_a">Option A</Label>
                    <Input
                      id="option_a"
                      value={formData.option_a}
                      onChange={(e) =>
                        setFormData({ ...formData, option_a: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_b">Option B</Label>
                    <Input
                      id="option_b"
                      value={formData.option_b}
                      onChange={(e) =>
                        setFormData({ ...formData, option_b: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_c">Option C</Label>
                    <Input
                      id="option_c"
                      value={formData.option_c}
                      onChange={(e) =>
                        setFormData({ ...formData, option_c: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_d">Option D</Label>
                    <Input
                      id="option_d"
                      value={formData.option_d}
                      onChange={(e) =>
                        setFormData({ ...formData, option_d: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="space-y-2">
                  <Label htmlFor="correct_answer">Correct Answer</Label>
                  <Input
                    id="correct_answer"
                    value={formData.correct_answer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correct_answer: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="A / B / C / D"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Dummy Question
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
