import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Search, 
  Brain, 
  Keyboard, 
  FlaskConical, 
  SpellCheck, 
  Landmark, 
  Flag,
  Gamepad2,
  Trophy
} from "lucide-react";

const gameIcons = {
  "math-quiz": Calculator,
  "word-search": Search,
  "memory-match": Brain,
  "typing-sprint": Keyboard,
  "science-quiz": FlaskConical,
  "spelling-bee": SpellCheck,
  "history-quiz": Landmark,
  "flags-africa": Flag,
} as const;

export function GamesGrid() {
  const { data: games = [] } = useQuery({
    queryKey: ["/api/educational-games"],
  });

  // Sample games data if API returns empty
  const sampleGames = [
    {
      id: "math-quiz",
      title: "Math Quiz Challenge",
      description: "Test your math skills with timed quizzes across all grade levels.",
      gameType: "math-quiz",
      difficulty: "medium",
      subject: "Mathematics",
      gradeLevel: "Grades 1-12",
    },
    {
      id: "word-search",
      title: "Word Search",
      description: "Find hidden words in multiple South African languages.",
      gameType: "word-search",
      difficulty: "easy",
      subject: "Languages",
      gradeLevel: "All Languages",
    },
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Improve memory skills by matching educational content pairs.",
      gameType: "memory-match",
      difficulty: "medium",
      subject: "General",
      gradeLevel: "All Ages",
    },
    {
      id: "typing-sprint",
      title: "Typing Sprint",
      description: "Improve typing speed and accuracy with educational texts.",
      gameType: "typing-sprint",
      difficulty: "hard",
      subject: "Computer Skills",
      gradeLevel: "Grade 4+",
    },
    {
      id: "science-quiz",
      title: "Science Quiz",
      description: "Explore scientific concepts through interactive quizzes.",
      gameType: "science-quiz",
      difficulty: "medium",
      subject: "Natural Sciences",
      gradeLevel: "Grade 7-12",
    },
    {
      id: "spelling-bee",
      title: "Spelling Bee",
      description: "Master spelling in English and indigenous languages.",
      gameType: "spelling-bee",
      difficulty: "easy",
      subject: "Languages",
      gradeLevel: "Grade 1-8",
    },
    {
      id: "history-quiz",
      title: "SA History Quiz",
      description: "Learn about South African history and heritage.",
      gameType: "history-quiz",
      difficulty: "medium",
      subject: "Social Sciences",
      gradeLevel: "Grade 4-12",
    },
    {
      id: "flags-africa",
      title: "African Flags",
      description: "Identify flags and learn about African countries.",
      gameType: "flags-africa",
      difficulty: "easy",
      subject: "Geography",
      gradeLevel: "Geography",
    },
  ];

  const displayGames = Array.isArray(games) && games.length > 0 ? games : sampleGames;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getGameColor = (gameType: string) => {
    const colors = {
      "math-quiz": "from-blue-500 to-blue-600",
      "word-search": "from-green-500 to-green-600", 
      "memory-match": "from-purple-500 to-purple-600",
      "typing-sprint": "from-orange-500 to-orange-600",
      "science-quiz": "from-teal-500 to-teal-600",
      "spelling-bee": "from-yellow-500 to-yellow-600",
      "history-quiz": "from-indigo-500 to-indigo-600",
      "flags-africa": "from-emerald-500 to-emerald-600",
    } as const;
    
    return colors[gameType as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  return (
    <section id="games" className="py-20 themed-bg-secondary">
      <div className="max-w-7xl mx-auto px-4" data-testid="games-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold themed-text mb-4">Educational Games Zone</h2>
          <p className="text-xl themed-text-secondary max-w-3xl mx-auto">
            Learn through play with our collection of educational games designed to make learning fun and engaging across all subjects and grade levels.
          </p>
        </div>

        {/* Featured Games Showcase */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                alt="Children learning through educational games and fun activities" 
                className="w-full max-w-md h-32 object-cover rounded-lg opacity-80"
              />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
                <h3 className="text-2xl font-bold themed-text">Featured Challenge</h3>
              </div>
              <p className="themed-text-secondary mb-4">
                Complete daily challenges to earn points and unlock new game levels!
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-6 py-3"
                data-testid="daily-challenge-button"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Start Daily Challenge
              </Button>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="games-grid">
          {Array.isArray(displayGames) && displayGames.map((game: any, index: number) => {
            const IconComponent = gameIcons[game.gameType as keyof typeof gameIcons] || Gamepad2;
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="themed-bg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${getGameColor(game.gameType)} rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-center">
                      <CardTitle className="themed-text mb-2">{game.title}</CardTitle>
                      <Badge 
                        className={getDifficultyColor(game.difficulty)}
                        data-testid={`game-difficulty-${game.id}`}
                      >
                        {game.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <p className="themed-text-secondary text-sm mb-4">{game.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="themed-text-secondary">Subject:</span>
                        <Badge variant="outline" data-testid={`game-subject-${game.id}`}>
                          {game.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="themed-text-secondary">Grade:</span>
                        <Badge variant="secondary" data-testid={`game-grade-${game.id}`}>
                          {game.gradeLevel}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      data-testid={`play-game-${game.id}`}
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Play Game
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Game Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold themed-text text-center mb-8">Game Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Mathematics", icon: Calculator, count: 12, color: "from-blue-500 to-blue-600" },
              { name: "Languages", icon: SpellCheck, count: 8, color: "from-green-500 to-green-600" },
              { name: "Sciences", icon: FlaskConical, count: 6, color: "from-purple-500 to-purple-600" },
              { name: "Geography", icon: Flag, count: 4, color: "from-orange-500 to-orange-600" },
            ].map((category, index) => {
              const IconComponent = category.icon;
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="themed-bg hover:themed-bg-accent transition-colors cursor-pointer text-center p-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold themed-text mb-1">{category.name}</h4>
                    <p className="text-sm themed-text-secondary">{category.count} games</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Teaser */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-2xl p-8 text-center">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold themed-text mb-4">Weekly Leaderboard</h3>
          <p className="themed-text-secondary mb-6">
            Compete with learners across South Africa and climb the ranks!
          </p>
          <Button 
            variant="outline"
            className="hover:bg-yellow-50 hover:border-yellow-300"
            data-testid="view-leaderboard-button"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </section>
  );
}
