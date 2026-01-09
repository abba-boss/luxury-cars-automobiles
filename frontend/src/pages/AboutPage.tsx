import { PublicLayout } from "@/components/layout/PublicLayout";
import { Users, Car, Shield, Phone, Mail, MapPin } from "lucide-react";

const AboutPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1800px] mx-auto section-padding">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full mb-8">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wider">ABOUT US</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Nigeria's Premier <span className="text-primary">Car Marketplace</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              We connect buyers and sellers in the premium automotive market with transparency, trust, and excellence.
            </p>
          </div>

          {/* Our Story */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded by Dr. Aliyu Mohammad (Al-Amin), a graduate of Ahmadu Bello University Zaria,
                  Sarkin Mota Automobiles has grown from a vision to deliver quality vehicles to customers across Nigeria.
                  Starting with a passion for automobiles and leveraging digital content strategy,
                  Dr. Aliyu built a trusted brand known for transparency and quality.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our name Sarkin Mota (which means "Master of Cars" in Hausa) reflects our commitment to being the
                  premier destination for automotive excellence in Nigeria. We've built our reputation on integrity,
                  quality, and customer satisfaction.
                </p>
                {/* Note: The literal meaning "Master of Cars" is preserved as a description of the original brand name */}
                <p className="text-muted-foreground">
                  Today, we're proud to be the trusted choice for thousands of car buyers across Nigeria,
                  operating from our headquarters in Abuja and serving customers nationwide with verified vehicles
                  and transparent transactions.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl p-8 border border-border">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary rounded-xl flex items-center justify-center mb-6">
                  <Car className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To revolutionize the automotive market in Nigeria by delivering quality vehicles with
                  transparency, trust, and nationwide service coverage.
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-card border border-border rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Trust & Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in open, honest communication and transparent pricing with no hidden fees or surprises.
                </p>
              </div>
              <div className="text-center p-8 bg-card border border-border rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Quality Focus</h3>
                <p className="text-muted-foreground">
                  We meticulously curate our inventory to ensure only the highest quality vehicles are available.
                </p>
              </div>
              <div className="text-center p-8 bg-card border border-border rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority, and we go above and beyond to exceed expectations.
                </p>
              </div>
            </div>
          </section>

          {/* Leadership */}
          <section>
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">Our Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Dr. Aliyu Mohammad (Al-Amin)</h3>
                <p className="text-muted-foreground text-sm">Founder & CEO</p>
                {/* <p className="text-xs text-muted-foreground mt-2">Graduate of Ahmadu Bello University Zaria</p> */}
              </div>
            </div>

            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                Dr. Aliyu Mohammad, known as luxury car, is an automotive entrepreneur who transformed his
                passion for automobiles into a successful business. Leveraging digital content and social
                media, he built a trusted brand known for transparency in the automotive industry.
              </p>
              {/* Replaced "Sarkin Mota" brand name with generic term */}
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;