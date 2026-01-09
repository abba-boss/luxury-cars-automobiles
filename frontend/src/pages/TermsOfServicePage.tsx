import { PublicLayout } from "@/components/layout/PublicLayout";
import { FileText, Scale, Calendar, Shield } from "lucide-react";

const TermsOfServicePage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1800px] mx-auto section-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <Scale className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wider">TERMS OF SERVICE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Terms and conditions governing your use of our services
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Effective Date</h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service are effective as of December 2024 and govern your use of
                Sarkin Mota Automobiles services, including our website and related services.
                Sarkin Mota operates at 3F3G+74Q, Olusegun Obasanjo Way, beside NNPC Mega Gas Station,
                Central Business District, Abuja 900103, FCT, Nigeria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Use of Our Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Eligibility</h3>
                  <p className="text-muted-foreground">
                    By using our services, you represent that you are at least 18 years old and capable of
                    entering into binding contracts. You must provide accurate information when using our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Account Security</h3>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the security of your account and all activities
                    that occur under your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Vehicle Purchase Terms</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Vehicle Condition</h3>
                  <p className="text-muted-foreground">
                    {/* Replaced "Sarkin Mota" brand name with generic term */}
                    All vehicles sold through luxury car are carefully inspected and described
                    accurately. We provide detailed information about each vehicle's condition, features,
                    and history to the best of our knowledge.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Vehicle Availability</h3>
                  <p className="text-muted-foreground">
                    Vehicle availability may change without notice. We make every effort to ensure
                    accurate inventory information, but please contact us directly to confirm
                    availability before visiting.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pricing</h3>
                  <p className="text-muted-foreground">
                    All prices are subject to verification at the time of purchase. Prices may change
                    without notice until a purchase agreement is signed.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Services</h2>
              <p className="text-muted-foreground mb-4">
                {/* Replaced "Sarkin Mota" brand name with generic term */}
                luxury car provides automotive sales, vehicle information, and related services.
                We act as the dealer and seller of the vehicles listed on our platform.
              </p>
              <p className="text-muted-foreground">
                Our nationwide delivery service is subject to additional terms and fees, which will be
                communicated at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                {/* Replaced "Sarkin Mota" brand name with generic term */}
                luxury car and its operators are not liable for any damages arising from the
                use of our services or the purchase of vehicles through our platform, except as required
                by law.
              </p>
              <p className="text-muted-foreground">
                Our liability is limited to the amount paid for the vehicle or service that gave rise
                to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms of Service shall be governed by and construed in accordance with the laws
                of Nigeria, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-secondary/20 p-6 rounded-xl space-y-2">
                {/* Replaced "Sarkin Mota" brand name with generic term */}
                <p className="font-medium text-foreground">luxury car</p>
                <p className="text-muted-foreground">3F3G+74Q, Olusegun Obasanjo Way</p>
                <p className="text-muted-foreground">Beside NNPC Mega Gas Station</p>
                <p className="text-muted-foreground">Central Business District, Abuja 900103</p>
                <p className="text-muted-foreground">FCT, Nigeria</p>
                <p className="text-muted-foreground">Phone: +234 701 513 6111</p>
                <p className="text-muted-foreground">Email: alaminsarkinmota@gmail.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfServicePage;