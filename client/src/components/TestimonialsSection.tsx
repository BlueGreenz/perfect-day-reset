import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import successGroupImage from "@assets/21x9_A_diverse_group_of_confident_pro.png";
import { Link } from "wouter";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "The Perfect Day Reset completely transformed how I structure my days. I'm now accomplishing more while feeling less stressed. The morning routine alone was worth the investment!",
    benefit: "More productive, less stressed",
    rating: 5
  },
  {
    name: "Michael T.",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "As someone who has tried countless productivity systems, this is the first one that actually stuck. The difference is that it integrates seamlessly with real life instead of requiring my life to change for the system.",
    benefit: "Finally found a system that works",
    rating: 5
  },
  {
    name: "Jennifer L.",
    role: "Healthcare Provider",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "Working in healthcare with crazy shifts made me think no routine could work for me. This program proved me wrong - the flexible approach and focus on energy management rather than rigid scheduling was exactly what I needed.",
    benefit: "Energy management over rigid scheduling",
    rating: 5
  },
  {
    name: "David R.",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "I was skeptical about yet another wellness program, but the Perfect Day Reset is different. It's practical, science-based, and delivers results from day one. The digital detox part was life-changing for me.",
    benefit: "Practical and immediate results",
    rating: 5
  },
  {
    name: "Emma C.",
    role: "Parent & Freelancer",
    image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "As a parent and freelancer, finding balance seemed impossible. The Perfect Day Reset gave me a blueprint for recharging that works even with my chaotic schedule. I do the reset twice a month now and it's been transformative.",
    benefit: "Balance despite a busy schedule",
    rating: 5
  },
  {
    name: "Alex M.",
    role: "University Student",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "Between studies, part-time work, and social life, I was burning out fast. The Perfect Day Reset taught me how to actually rest and recharge. My focus improved dramatically and I'm finally enjoying my university experience.",
    benefit: "Better focus and energy for studies",
    rating: 5
  },
  {
    name: "Rachel S.",
    role: "Fitness Coach",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "Even as a fitness professional, I was struggling with my own wellness routine. The Perfect Day Reset showed me how to integrate mind, body, and spirit in a way that actually works. Now I recommend it to all my clients.",
    benefit: "Holistic wellness approach that works",
    rating: 5
  },
  {
    name: "James P.",
    role: "Sales Manager",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "High-pressure sales environment left me completely drained. The Perfect Day Reset gave me a system to reset my energy and mindset. My performance improved and I'm actually enjoying work again instead of just surviving it.",
    benefit: "Renewed energy and work enjoyment",
    rating: 5
  },
  {
    name: "Lisa H.",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "Creative blocks were killing my career. The Perfect Day Reset unlocked something in me - the combination of movement, mindfulness, and digital detox sparked creativity I didn't know I had. It's like hitting a reset button for inspiration.",
    benefit: "Breakthrough creative blocks",
    rating: 5
  },
  {
    name: "Tom W.",
    role: "Retired Teacher",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content: "At 62, I thought it was too late to change my habits. The Perfect Day Reset proved me wrong. The gentle approach and focus on small, meaningful changes gave me a new lease on life. I feel 10 years younger.",
    benefit: "Proof it's never too late to change",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Calculate expiration date (48 hours from now)
  const expireDate = new Date();
  expireDate.setHours(expireDate.getHours() + 48);
  
  const nextTestimonial = () => {
    if (activeIndex + displayCount < testimonials.length) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };
  
  const prevTestimonial = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(testimonials.length - displayCount);
    }
  };

  // Auto-play functionality for continuous right-to-left movement
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 4000); // Move every 4 seconds
    
    return () => clearInterval(interval);
  }, [activeIndex, displayCount, isAutoPlaying]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setDisplayCount(3);
      } else if (window.innerWidth >= 768) {
        setDisplayCount(2);
      } else {
        setDisplayCount(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate displayed testimonials
  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + displayCount);

  return (
    <section 
      id="testimonials"
      className="relative bg-gradient-to-b from-white via-orange-50/30 to-orange-50 pt-8 pb-16 md:pt-12 md:pb-24"
      style={{
        backgroundImage: `url(${successGroupImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability and smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/60 via-orange-50/70 to-orange-50/85"></div>
      
      <div className="container relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="h-7 w-7 text-emerald-500" />
              <h2 className="text-3xl md:text-5xl font-black text-emerald-600 tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent drop-shadow-sm">SUCCESS STORIES</h2>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                setIsAutoPlaying(false);
                prevTestimonial();
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                setIsAutoPlaying(false);
                nextTestimonial();
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="ml-2 text-xs text-gray-500">
              {isAutoPlaying ? "Auto-playing" : "Paused"}
            </div>
          </div>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {visibleTestimonials.map((testimonial, index) => (
            <div 
              key={index + activeIndex} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 transform hover:scale-105"
            >
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>
              
              <div className="mb-6">
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm font-medium text-primary">{testimonial.benefit}</p>
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name} profile photo`} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center md:hidden mb-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                setIsAutoPlaying(false);
                prevTestimonial();
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                setIsAutoPlaying(false);
                nextTestimonial();
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="ml-2 text-xs text-gray-500">
              {isAutoPlaying ? "Auto" : "Paused"}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-16">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Transform Your Daily Routine Today</h3>
            <p className="text-gray-700 mb-6">
              Join our community of satisfied users who have discovered the power of the Perfect Day Reset. One structured day can change everything.
            </p>
            <Link href="/what-you-get">
              <Button 
                size="lg" 
                className="cta-button bg-primary text-white font-medium px-8 py-6 rounded-full hover:bg-green-600 transition text-lg"
                onClick={() => {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                Get the Perfect Day Reset – $67
              </Button>
            </Link>
          </div>
          
          <div>
            <CountdownTimer 
              endDate={expireDate}
              title="Launch Special"
              description="For our website launch: Get 30% off with all bonus materials!"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
