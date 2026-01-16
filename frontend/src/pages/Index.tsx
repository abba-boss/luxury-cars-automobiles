import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { CarHighlights } from "@/components/home/CarHighlights";
import { TeslaFeatures } from "@/components/home/TeslaFeatures";
import PremiumBrandCarousel from "@/components/home/PremiumBrandCarousel";

const Index = () => {
  return (
    <PublicLayout>
      <HeroCarousel />
      <PremiumBrandCarousel />
      <CategoryGrid />
      <CarHighlights />
      <FeaturedCars />
      <TeslaFeatures />
    </PublicLayout>
  );
};

export default Index;
