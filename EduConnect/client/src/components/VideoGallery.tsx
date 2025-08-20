import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { SAMPLE_VIDEOS } from "@/lib/constants";

export function VideoGallery() {
  const [activeTab, setActiveTab] = useState("foundation");
  
  const tabs = [
    { id: "foundation", label: "Foundation Phase" },
    { id: "intermediate", label: "Intermediate Phase" },
    { id: "senior", label: "Senior Phase" },
    { id: "fet", label: "FET Phase" },
    { id: "abet", label: "ABET" },
  ];

  return (
    <section className="py-20 themed-bg" data-testid="video-gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold themed-text mb-4">Educational Video Library</h2>
          <p className="text-xl themed-text-secondary">Curated content aligned with South African curriculum</p>
        </div>
        
        {/* Grade Level Tabs */}
        <div className="flex flex-wrap justify-center mb-8 space-x-2" data-testid="video-tabs">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "secondary"}
              onClick={() => setActiveTab(tab.id)}
              className="mb-2"
              data-testid={`video-tab-${tab.id}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        
        {/* Video Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          data-testid="video-grid"
        >
          {SAMPLE_VIDEOS.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="themed-bg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {/* Video Thumbnail */}
                <div className="relative">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-primary text-white hover:bg-primary/90 rounded-full"
                      data-testid={`play-video-${video.id}`}
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Play
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {video.duration}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold themed-text mb-2">{video.title}</h3>
                  <p className="themed-text-secondary mb-4">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" data-testid={`video-grade-${video.id}`}>
                      {video.grade}
                    </Badge>
                    <Badge variant="outline" data-testid={`video-subject-${video.id}`}>
                      {video.subject}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
