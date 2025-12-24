import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Shield, Award, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "demo-drive",
    icon: Calendar,
    title: "Book Demo Drive",
    description: "Experience the thrill firsthand. Schedule a personalized test drive at your convenience.",
    cta: "Schedule Now",
    href: "/book-demo",
  },
  {
    id: "inspection",
    icon: Shield,
    title: "Vehicle Inspection",
    description: "Every vehicle undergoes a rigorous 200-point inspection by certified technicians.",
    cta: "Learn More",
    href: "/inspection",
  },
  {
    id: "certified",
    icon: Award,
    title: "Certified Pre-Owned",
    description: "Our certified vehicles come with extended warranty and comprehensive service history.",
    cta: "View CPO",
    href: "/certified",
  },
];

const stats = [
  { value: "500+", label: "Premium Vehicles" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "24/7", label: "Support Available" },
  { value: "15+", label: "Years Experience" },
];

const highlights = [
  "Transparent pricing with no hidden fees",
  "Flexible financing options available",
  "Nationwide delivery to your doorstep",
  "30-day money-back guarantee",
  "Complimentary first service",
  "24/7 roadside assistance",
];

export function TeslaFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-5 py-2 border border-primary/60 text-primary text-xs font-semibold tracking-[0.3em] mb-6">
            WHY CHOOSE US
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            The Premium Experience
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We redefine car buying with unmatched service, transparency, and a curated selection of exceptional vehicles
          </p>
        </div>

        {/* Feature Cards - Tesla Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cn(
                "group relative p-8 md:p-10 border transition-all duration-500 cursor-pointer",
                activeFeature === index
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border hover:border-primary/50 bg-card/50"
              )}
              onMouseEnter={() => setActiveFeature(index)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-all duration-500",
                activeFeature === index ? "bg-primary" : "bg-muted"
              )}>
                <feature.icon className={cn(
                  "h-6 w-6 transition-colors duration-500",
                  activeFeature === index ? "text-primary-foreground" : "text-foreground"
                )} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

              {/* CTA */}
              <Link to={feature.href} className="inline-flex items-center text-primary font-medium group/link">
                {feature.cta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>

              {/* Hover Line */}
              <div className={cn(
                "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500",
                activeFeature === index ? "w-full" : "w-0"
              )} />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="relative py-16 mb-24">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center bg-background px-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Highlights List */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              What Sets Us Apart
            </h3>
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div
                  key={highlight}
                  className="flex items-center gap-4 p-4 bg-card/50 border border-border rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - CTA Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-3xl" />
            <div className="relative bg-card border border-border p-10 md:p-12">
              <Zap className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Find Your Perfect Car?
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Browse our curated collection of premium vehicles and experience car buying the way it should be.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cars">
                  <Button className="btn-luxury w-full sm:w-auto">
                    Browse Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="btn-luxury-outline w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
