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
        <div className="pt-16 sm:pt-24 md:pt-32 pb-6 sm:pb-8 section-padding bg-background">
          <div className="max-w-full mx-auto">
            {title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="section-padding pb-12 sm:pb-16">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </div>
    </PublicLayout>
  );
}