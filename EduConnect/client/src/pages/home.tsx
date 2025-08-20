import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { VideoGallery } from "@/components/VideoGallery";
import { ChatInterface } from "@/components/ChatInterface";
import { QuizInterface } from "@/components/QuizInterface";
import { GamesGrid } from "@/components/GamesGrid";
import { ContactForm } from "@/components/ContactForm";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  useEffect(() => {
    // Track an example ad impression for demo (optional)
    // apiRequest('POST', `/api/ads/${someAdId}/impression`).catch(() => {});
  }, []);
  return (
    <div className="min-h-screen themed-bg theme-transition">
      <Navigation />
      <HeroSection />
      <VideoGallery />
      <ChatInterface />
      <QuizInterface />
      <GamesGrid />
      <ContactForm />
      
      {/* Footer */}
      <footer className="themed-bg-secondary border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  🎓
                </div>
                <div>
                  <h3 className="text-lg font-bold themed-text">Funda-App</h3>
                  <p className="text-sm themed-text-secondary">Empowering SA Education</p>
                </div>
              </div>
              <p className="themed-text-secondary text-sm">
                Transforming education in South Africa through innovative technology, 
                multilingual support, and collaborative learning experiences.
              </p>
            </div>
            
            {/* Learning */}
            <div>
              <h4 className="font-semibold themed-text mb-4">Learning</h4>
              <ul className="space-y-2 themed-text-secondary text-sm">
                <li><a href="#practice" className="hover:text-primary transition-colors">Practice Zone</a></li>
                <li><a href="#games" className="hover:text-primary transition-colors">Educational Games</a></li>
                <li><a href="#study-groups" className="hover:text-primary transition-colors">Study Groups</a></li>
                <li><a href="#videos" className="hover:text-primary transition-colors">Video Library</a></li>
                <li><a href="#ai" className="hover:text-primary transition-colors">AI Tutors</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold themed-text mb-4">Support</h4>
              <ul className="space-y-2 themed-text-secondary text-sm">
                <li><a href="#contact" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Live Chat</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Wellness Resources</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Report Issue</a></li>
              </ul>
            </div>
            
            {/* Languages */}
            <div>
              <h4 className="font-semibold themed-text mb-4">Languages</h4>
              <ul className="space-y-2 themed-text-secondary text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">English</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">isiZulu</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Afrikaans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">isiXhosa</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">View All (11)</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="themed-text-secondary text-sm">
              © 2024 Funda-App. All rights reserved. Proudly South African.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm themed-text-secondary">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
