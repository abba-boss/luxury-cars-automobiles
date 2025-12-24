import { PublicLayout } from "./PublicLayout";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <PublicLayout>
      {/* Page Header */}
      {(title || subtitle) && (
        <div className="pt-32 pb-8 section-padding bg-background">
          <div className="max-w-[1800px] mx-auto">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="section-padding pb-16">
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </div>
    </PublicLayout>
  );
}