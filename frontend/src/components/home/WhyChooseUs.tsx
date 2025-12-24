import { Shield, Award, Clock, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Vehicles",
    description: "Every car undergoes rigorous inspection and verification before listing.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "We curate only the finest automobiles that meet our exacting standards.",
  },
  {
    icon: Clock,
    title: "Seamless Process",
    description: "From inquiry to ownership, we ensure a smooth and efficient experience.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Our dedicated team is available to assist you every step of the way.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block px-4 py-1.5 border border-primary/50 text-primary text-xs font-medium tracking-[0.2em] mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Experience Excellence
              <span className="text-gradient-gold block">in Every Detail</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {/* Replaced "Sarkin Mota" brand name with generic term */}
              At luxury car, we don't just sell cars — we curate automotive experiences.
              Our commitment to excellence ensures that every vehicle we present meets
              the highest standards of quality, performance, and luxury.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">500+</p>
                <p className="text-sm text-muted-foreground">Vehicles Sold</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">5+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
