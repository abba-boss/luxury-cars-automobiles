import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const SimpleIndex = () => (
  <div className="min-h-screen bg-background p-8">
    <h1 className="text-4xl font-bold mb-4">Sarkin Mota Automobiles</h1>
    <p className="text-lg text-muted-foreground">Welcome to our car dealership</p>
  </div>
);

const MinimalApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleIndex />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default MinimalApp;
