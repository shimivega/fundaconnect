import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Gamepad2, Users, School, Bot, Headphones, PlayCircle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  id: string;
  [key: string]: any;
}

function FloatingCard({ children, delay = 0, ...props }: FloatingCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        rotateX: 10, 
        rotateY: 10,
        transition: { duration: 0.3 }
      }}
      animate={{ 
        y: [0, -10, 0],
        transition: { 
          duration: 3 + delay,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`dashboard-card-${props.id}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FloatingDashboard() {
  const dashboardItems = [
    {
      id: "practice-zone",
      icon: Brain,
      title: "Practice Zone",
      description: "MCQs & Essays across all subjects",
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      id: "games-zone", 
      icon: Gamepad2,
      title: "Games Zone",
      description: "Educational games & quizzes",
      color: "from-green-500 to-emerald-600",
      delay: 0.5,
    },
    {
      id: "study-groups",
      icon: Users,
      title: "Study Groups", 
      description: "Collaborate with peers",
      color: "from-purple-500 to-violet-600",
      delay: 1,
    },
    {
      id: "ai-assistants",
      icon: Bot,
      title: "AI Assistants",
      description: "Smart tutoring support", 
      color: "from-orange-500 to-red-600",
      delay: 1.5,
    },
    {
      id: "educational-videos",
      icon: PlayCircle,
      title: "Educational Videos",
      description: "Curated learning content",
      color: "from-pink-500 to-rose-600", 
      delay: 2,
    },
    {
      id: "classroom",
      icon: School,
      title: "Virtual Classroom",
      description: "Live lessons & streaming",
      color: "from-cyan-500 to-blue-600",
      delay: 2.5,
    },
    {
      id: "support-center",
      icon: Headphones,
      title: "Support Center", 
      description: "Help & mentorship",
      color: "from-yellow-500 to-orange-600",
      delay: 3,
    },
    {
      id: "contact-hub",
      icon: Mail,
      title: "Contact Hub",
      description: "Get in touch with us",
      color: "from-indigo-500 to-purple-600",
      delay: 3.5,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto" data-testid="floating-dashboard">
      {dashboardItems.map((item) => {
        const IconComponent = item.icon;
        
        return (
          <FloatingCard key={item.id} id={item.id} delay={item.delay}>
            <Card className="themed-bg-secondary rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:scale-110`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold themed-text mb-2">{item.title}</h3>
                <p className="text-sm themed-text-secondary">{item.description}</p>
              </CardContent>
            </Card>
          </FloatingCard>
        );
      })}
    </div>
  );
}
