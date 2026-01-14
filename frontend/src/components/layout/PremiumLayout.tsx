import { PremiumHeader } from "@/components/layout/PremiumHeader";
import { PremiumFooter } from "@/components/layout/PremiumFooter";

interface PremiumLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PremiumLayout({ children, title, subtitle }: PremiumLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <PremiumHeader title={title} subtitle={subtitle} />
      <main className="flex-1">
        {children}
      </main>
      <PremiumFooter />
    </div>
  );
}