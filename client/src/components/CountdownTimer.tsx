import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TimerIcon, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface CountdownTimerProps {
  endDate: Date;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  onExpire?: () => void;
}

export default function CountdownTimer({
  endDate,
  title = "Limited Time Offer",
  description = "This special price is only available for a limited time",
  ctaText = "Get the Perfect Day Reset – $19",
  ctaLink = "/what-you-get",
  onExpire
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        if (onExpire) onExpire();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Set up interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (isExpired) {
    return (
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="font-medium text-lg">Offer Expired</h3>
          </div>
          <p className="text-gray-700 mb-4">
            This special offer has ended, but you can still get the Perfect Day Reset at the regular price.
          </p>
          <a href={ctaLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full">
              Get the Perfect Day Reset <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 overflow-hidden relative shadow-md">
      <div className="absolute top-0 right-0">
        <Badge variant="destructive" className="rounded-none rounded-bl-md px-3 py-1">
          Limited Time
        </Badge>
      </div>
      <CardContent className="p-6 pt-10">
        <div className="flex flex-col items-center text-center">
          <h3 className="font-bold text-xl mb-2">{title}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          
          <div className="flex justify-center gap-3 md:gap-5 mb-6">
            <TimeUnit value={timeLeft.days} unit="Days" />
            <TimeUnit value={timeLeft.hours} unit="Hours" />
            <TimeUnit value={timeLeft.minutes} unit="Minutes" />
            <TimeUnit value={timeLeft.seconds} unit="Seconds" />
          </div>
          
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <TimerIcon className="h-4 w-4" />
            <p className="text-sm font-medium">Hurry, offer ends soon!</p>
          </div>
          
          <Link href={ctaLink}>
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary-dark text-white"
              onClick={() => {
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function TimeUnit({ value, unit }: { value: number, unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white text-primary font-bold text-xl md:text-2xl w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
        {value < 10 ? `0${value}` : value}
      </div>
      <span className="text-xs mt-1 text-gray-600">{unit}</span>
    </div>
  );
}