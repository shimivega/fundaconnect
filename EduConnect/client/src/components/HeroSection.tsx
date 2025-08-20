import { FloatingDashboard } from "./FloatingDashboard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden themed-bg-gradient py-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
          alt="South African students learning with technology" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in" data-testid="hero-content">
          <h1 className="text-5xl md:text-6xl font-bold themed-text mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Funda-App</span>
          </h1>
          <p className="text-xl themed-text-secondary max-w-3xl mx-auto mb-8">
            South Africa's premier educational platform connecting learners, teachers, and communities through innovative learning experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium" data-testid="feature-badge-languages">11 Languages</span>
            <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium" data-testid="feature-badge-grades">All Grades</span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium" data-testid="feature-badge-collaboration">Real-time Collaboration</span>
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium" data-testid="feature-badge-ai">AI-Powered</span>
          </div>
        </div>
        
        {/* 3D Floating Dashboard */}
        <FloatingDashboard />
      </div>
    </section>
  );
}
