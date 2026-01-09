import { PublicLayout } from "@/components/layout/PublicLayout";
import { Shield, Clock, Users, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-[1800px] mx-auto section-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wider">PRIVACY POLICY</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              How we collect, use, and protect your personal information
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Effective Date</h2>
              <p className="text-muted-foreground mb-4">
                This Privacy Policy is effective as of December 2024 and governs our privacy practices for
                Sarkin Mota Automobiles, operating at 3F3G+74Q, Olusegun Obasanjo Way, beside NNPC Mega Gas Station,
                Central Business District, Abuja 900103, FCT, Nigeria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    When you visit our website, contact us, or make a purchase, we may collect personal 
                    information including your name, email address, phone number, and location.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Automotive Preferences</h3>
                  <p className="text-muted-foreground">
                    We collect information about your automotive preferences and interests to provide 
                    personalized recommendations and services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We collect information on how our website is accessed and used, including technical 
                    information such as browser type, IP address, and pages visited.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">How We Use Your Information</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To send marketing emails with your consent</li>
                <li>To analyze usage and improve our website</li>
                <li>To process transactions and send related information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Data Protection</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-muted-foreground">
                Our team is trained in data protection procedures and we regularly review our security 
                measures to ensure they remain effective.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Rights</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicyPage;