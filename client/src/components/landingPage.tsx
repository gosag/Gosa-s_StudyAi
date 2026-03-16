import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Brain, BookOpen, PenTool, TrendingUp, Presentation, PlayCircle, MessageSquare, Book, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Github = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1.5-5-2.5-7-3"/></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Navbar = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">EchoStudy</span>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
        <a href="https://github.com/gosag" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Github className="h-4 w-4" /> GitHub
        </a>
      </nav>
      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
        </Link>
        <Link to="/signup">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <section className="relative overflow-hidden py-24 lg:py-32">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-3xl mx-auto space-y-8"
      >
        <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Zap className="h-3.5 w-3.5 mr-1 text-primary" /> v2.0 is now live
        </motion.div>
        
        <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Study Smarter with <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-600">AI</span>
        </motion.h1>
        
        <motion.p variants={fadeIn} className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Transform your notes and videos into interactive flashcards, quizzes, and a personalized AI tutor. Learn faster, remember longer.
        </motion.p>
        
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/signup">
            <Button size="lg" className="h-12 px-8 text-base">
              Get Started Free <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base">
            See Demo <PlayCircle className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      title: "AI Smart Summaries",
      description: "Instantly summarize long documents, articles, and videos into key takeaways.",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Spaced Repetition Flashcards",
      description: "Master any topic with AI-generated flashcards optimized for long-term retention.",
      icon: <Presentation className="h-6 w-6 text-purple-500" />
    },
    {
      title: "AI Quiz Generator",
      description: "Test your knowledge with automatically generated quizzes based on your study materials.",
      icon: <PenTool className="h-6 w-6 text-green-500" />
    },
    {
      title: "Socratic AI Tutor",
      description: "Chat with an AI tutor that guides you to the right answers instead of just giving them.",
      icon: <MessageSquare className="h-6 w-6 text-orange-500" />
    },
    {
      title: "Progress Tracking",
      description: "Visualize your learning journey with detailed analytics and mastery metrics.",
      icon: <TrendingUp className="h-6 w-6 text-red-500" />
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to master any subject</h2>
          <p className="text-lg text-muted-foreground">Stop memorizing, start understanding. EchoStudy provides a complete suite of AI tools designed for deep learning.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Upload content",
      description: "Upload PDFs, paste text, or link a YouTube video you want to study.",
      icon: <Book className="h-8 w-8" />
    },
    {
      title: "AI Analysis",
      description: "Our AI processes the material, extracting key concepts, summaries, and facts.",
      icon: <Brain className="h-8 w-8" />
    },
    {
      title: "Study & Track",
      description: "Review generated flashcards, take quizzes, and track your mastery over time.",
      icon: <TrendingUp className="h-8 w-8" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-16">How EchoStudy Works</h2>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent -z-10" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative flex flex-col items-center space-y-4"
            >
              <div className="h-24 w-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center shadow-xl text-primary relative z-10">
                {step.icon}
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold border-2 border-background">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold pt-4">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Medical Student",
      content: "EchoStudy has completely transformed how I study for board exams. The spaced repetition algorithms combined with AI flashcards save me hours of prep time every week.",
      avatar: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "Computer Science Major",
      content: "The Socratic AI Tutor is brilliant. When I'm stuck on a complex algorithms topic, it guides me to the answer instead of just giving it to me. True learning!",
      avatar: "SC"
    },
    {
      name: "Michael Torres",
      role: "Language Learner",
      content: "Being able to upload YouTube videos in foreign languages and get instant summaries and vocab quizzes has accelerated my fluency faster than any other app.",
      avatar: "MT"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-16">Loved by Students</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Card className="h-full bg-background">
                <CardHeader>
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                       {test.avatar}
                     </div>
                     <div>
                       <CardTitle className="text-base">{test.name}</CardTitle>
                       <CardDescription>{test.role}</CardDescription>
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic text-muted-foreground">"{test.content}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-primary/5"></div>
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
    
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-2xl mx-auto space-y-8"
      >
        <motion.h2 variants={fadeIn} className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ready to accelerate your learning?
        </motion.h2>
        <motion.p variants={fadeIn} className="text-xl text-muted-foreground">
          Join thousands of students who are studying smarter, not harder with EchoStudy's AI-powered platform.
        </motion.p>
        <motion.div variants={fadeIn} className="pt-4">
          <Link to="/signup">
            <Button size="lg" className="h-14 px-10 text-lg shadow-lg">
              Start Learning for Free
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t py-12 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">EchoStudy</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The intelligent study platform that uses AI to help you learn faster and remember longer.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="https://github.com/gosag" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
            <a href="https://linkedin.com/in/gosa-girma-b7b256326" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
          </ul>
        </div>
          </div>
      
      <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EchoStudy. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
