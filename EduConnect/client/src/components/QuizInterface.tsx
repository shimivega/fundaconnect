import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, Brain, Trophy, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  questions: QuizQuestion[];
  timeLimit: number;
}

export function QuizInterface() {
  const [selectedGrade, setSelectedGrade] = useState("foundation");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quizzes = [] } = useQuery({
    queryKey: ["/api/quizzes/grade", selectedGrade],
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/quiz-attempts", data);
    },
    onSuccess: () => {
      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}/${activeQuiz?.questions.length || 0}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-attempts"] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeQuiz && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, activeQuiz, quizCompleted]);

  const gradeOptions = [
    { value: "foundation", label: "Foundation Phase (Grade 1-3)" },
    { value: "intermediate", label: "Intermediate Phase (Grade 4-6)" },
    { value: "senior", label: "Senior Phase (Grade 7-9)" },
    { value: "fet", label: "FET Phase (Grade 10-12)" },
    { value: "abet", label: "ABET" },
  ];

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    setQuizCompleted(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    if (!activeQuiz) return;

    let correctAnswers = 0;
    activeQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setQuizCompleted(true);

    // Submit quiz attempt
    submitQuizMutation.mutate({
      quizId: activeQuiz.id,
      answers: selectedAnswers,
      score: correctAnswers,
    });
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeLeft(0);
    setQuizCompleted(false);
    setScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="practice" className="py-20 themed-bg" data-testid="quiz-interface-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold themed-text mb-4">Practice Zone</h2>
          <p className="text-xl themed-text-secondary max-w-3xl mx-auto">
            Test your knowledge with interactive quizzes across all subjects and grade levels. Track your progress and improve your understanding.
          </p>
        </div>

        {!activeQuiz ? (
          <>
            {/* Grade Level Selection */}
            <div className="flex flex-wrap justify-center gap-4 mb-12" data-testid="grade-selector">
              {gradeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedGrade === option.value ? "default" : "secondary"}
                  onClick={() => setSelectedGrade(option.value)}
                  className="mb-2"
                  data-testid={`grade-option-${option.value}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Quiz Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="quiz-grid">
              {Array.isArray(quizzes) && quizzes.map((quiz: Quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="themed-bg-secondary shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" data-testid={`quiz-grade-${quiz.id}`}>
                          {quiz.gradeLevel}
                        </Badge>
                      </div>
                      <CardTitle className="themed-text">{quiz.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="themed-text-secondary mb-4">{quiz.description}</p>
                      
                      <div className="flex items-center justify-between mb-4 text-sm themed-text-secondary">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {quiz.questions?.length || 0} questions
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {quiz.timeLimit} minutes
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" data-testid={`quiz-subject-${quiz.id}`}>
                          {quiz.subject}
                        </Badge>
                        <Button 
                          onClick={() => startQuiz(quiz)}
                          className="bg-primary hover:bg-primary/90 text-white"
                          data-testid={`start-quiz-${quiz.id}`}
                        >
                          Start Quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {Array.isArray(quizzes) && quizzes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                    alt="Educational materials and books" 
                    className="w-48 h-32 object-cover rounded-lg mx-auto mb-4 opacity-60"
                  />
                  <h3 className="text-lg font-semibold themed-text mb-2">No Quizzes Available</h3>
                  <p className="themed-text-secondary">Quizzes for this grade level will be available soon.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <AnimatePresence mode="wait">
            {!quizCompleted ? (
              /* Active Quiz */
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="max-w-4xl mx-auto"
                data-testid="active-quiz"
              >
                {/* Quiz Header */}
                <Card className="themed-bg-secondary shadow-lg mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="themed-text">{activeQuiz.title}</CardTitle>
                        <p className="themed-text-secondary">
                          Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center themed-text-secondary">
                          <Clock className="w-5 h-5 mr-2" />
                          <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={resetQuiz}
                          data-testid="quit-quiz-button"
                        >
                          Quit Quiz
                        </Button>
                      </div>
                    </div>
                    
                    <Progress 
                      value={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100} 
                      className="mt-4"
                    />
                  </CardHeader>
                </Card>

                {/* Question Card */}
                <Card className="themed-bg-secondary shadow-lg">
                  <CardHeader>
                    <CardTitle className="themed-text text-xl">
                      {activeQuiz.questions[currentQuestionIndex]?.question}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3" data-testid="answer-options">
                      {activeQuiz.questions[currentQuestionIndex]?.options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? "border-primary bg-primary/10 themed-text"
                              : "border-gray-200 hover:border-gray-300 themed-bg hover:themed-bg-accent themed-text"
                          }`}
                          data-testid={`answer-option-${index}`}
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        data-testid="previous-question-button"
                      >
                        Previous
                      </Button>
                      
                      <Button
                        onClick={nextQuestion}
                        disabled={selectedAnswers[currentQuestionIndex] === -1}
                        className="bg-primary hover:bg-primary/90 text-white"
                        data-testid="next-question-button"
                      >
                        {currentQuestionIndex === activeQuiz.questions.length - 1 ? "Complete Quiz" : "Next Question"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              /* Quiz Results */
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center"
                data-testid="quiz-results"
              >
                <Card className="themed-bg-secondary shadow-xl">
                  <CardHeader className="pb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl themed-text mb-2">Quiz Completed!</CardTitle>
                    <p className="themed-text-secondary">Great job on completing the quiz</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="text-6xl font-bold themed-text mb-4">
                      {score}/{activeQuiz.questions.length}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                          <span className="font-semibold themed-text">Correct</span>
                        </div>
                        <div className="text-2xl font-bold text-green-500">{score}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <XCircle className="w-6 h-6 text-red-500 mr-2" />
                          <span className="font-semibold themed-text">Incorrect</span>
                        </div>
                        <div className="text-2xl font-bold text-red-500">{activeQuiz.questions.length - score}</div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(score / activeQuiz.questions.length) * 100} 
                      className="mb-6"
                    />
                    
                    <div className="flex space-x-4 justify-center">
                      <Button 
                        onClick={() => startQuiz(activeQuiz)}
                        className="bg-primary hover:bg-primary/90 text-white"
                        data-testid="retake-quiz-button"
                      >
                        Retake Quiz
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={resetQuiz}
                        data-testid="back-to-quizzes-button"
                      >
                        Back to Quizzes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
