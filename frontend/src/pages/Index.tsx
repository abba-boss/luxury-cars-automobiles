import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { CarHighlights } from "@/components/home/CarHighlights";
import { TeslaFeatures } from "@/components/home/TeslaFeatures";
import { BrandShowcase } from "@/components/home/BrandShowcase";

const Index = () => {
  return (
    <PublicLayout>
      <HeroCarousel />
      <BrandShowcase />
      <CategoryGrid />
      <CarHighlights />
      <FeaturedCars />
      <TeslaFeatures />
    </PublicLayout>
  );
};

export default Index;
