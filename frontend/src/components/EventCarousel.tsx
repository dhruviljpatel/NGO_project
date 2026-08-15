import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import { useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"

interface EventCarouselProps {
  events: any[];
  user: any;
  registeredLocal: Record<string, boolean>;
  isPending: boolean;
  onRegister: (eventId: string) => void;
}

export function EventCarousel({ events, user, registeredLocal, isPending, onRegister }: EventCarouselProps) {
  const [swiper, setSwiper] = useState<any>(null);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-dashed rounded-3xl bg-card/30 text-foreground/70">
        <Calendar className="w-12 h-12 text-primary/40 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No upcoming events</h3>
        <p className="text-sm mt-2 text-center max-w-sm">We are currently planning our next initiatives. Check back soon or ensure you are registered to receive updates.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative px-0 py-8 overflow-hidden">
      <Swiper
        onSwiper={setSwiper}
        simulateTouch={false}
        grabCursor={false}
        centeredSlides={true}
        slidesPerView={'auto'}
        spaceBetween={-140}
        mousewheel={true}
        slideToClickedSlide={true}
        navigation={false}
        modules={[Navigation, Mousewheel]}
        className="w-full max-w-5xl mx-auto py-16"
        initialSlide={Math.floor(events.length / 2)}
      >
        {events.map((event: any, index: number) => (
          <SwiperSlide key={event.id} className="!w-[320px] md:!w-[360px]">
            {({ isActive }) => (
              <div className="relative h-full w-full">
                <Card className="glass-card flex flex-col h-full rounded-2xl border-t border-l border-white/40 dark:border-white/10 relative overflow-hidden transition-all duration-500 shadow-xl bg-card min-h-[380px]">
              {/* Note: The card's hover effects are removed for the carousel, scale is handled by Swiper */}
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={event.status === "Full" ? "secondary" : "default"} className="px-3 py-1 text-xs">
                    {event.status}
                  </Badge>
                  <Badge variant="outline" className="flex gap-1.5 items-center px-3 py-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium text-xs">{event._count?.registrations || 0}/{event.capacity}</span>
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-tight">{event.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2.5 mt-4">
                  <span className="flex items-center gap-2.5 text-foreground/80 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-primary" /> {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2.5 text-foreground/80 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" /> {event.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-foreground/60 leading-relaxed">{event.description}</p>
              </CardContent>
              <CardFooter className="mt-auto pt-4 relative z-20">
                <Button 
                  className="w-full gap-2 rounded-xl h-11 text-sm font-semibold shadow-md" 
                  disabled={!isActive || event.status === "Full" || registeredLocal[event.id] || (user && user.role !== 'VOLUNTEER') || isPending}
                  onClick={(e) => {
                    if (!isActive) { e.preventDefault(); return; }
                    onRegister(event.id);
                  }}
                >
                  {registeredLocal[event.id] ? "Registered" : event.status === "Full" ? "Event Full" : isPending ? "Registering..." : "Register Now"}
                </Button>
              </CardFooter>
            </Card>
            {!isActive && (
              <div 
                className="absolute inset-0 z-50 cursor-pointer rounded-2xl" 
                aria-label="Focus event card"
                onClick={() => {
                  if (swiper) {
                    swiper.slideTo(index);
                  }
                }}
              ></div>
            )}
            </div>
            )}
          </SwiperSlide>
        ))}
        {/* Custom Navigation Buttons using explicit click handlers */}
        <button 
          onClick={() => swiper?.slidePrev()}
          className="custom-swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full border-2 border-primary text-primary bg-background/50 backdrop-blur-sm transition-colors duration-300 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        
        <button 
          onClick={() => swiper?.slideNext()}
          className="custom-swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full border-2 border-primary text-primary bg-background/50 backdrop-blur-sm transition-colors duration-300 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </Swiper>
      
      {/* Custom CSS for Swiper Slides */}
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-slide {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
          opacity: 0.3 !important;
          transform: scale(0.85) !important;
          filter: blur(2px);
          z-index: 1;
        }
        /* The two full slides adjacent to the center */
        .swiper-slide-prev, .swiper-slide-next {
          opacity: 0.8 !important;
          transform: scale(0.95) !important;
          filter: blur(0px);
          z-index: 5;
        }
        /* The single focused center slide */
        .swiper-slide-active {
          opacity: 1 !important;
          transform: scale(1.05) !important;
          filter: blur(0px);
          z-index: 10;
        }
      `}} />
    </div>
  );
}
