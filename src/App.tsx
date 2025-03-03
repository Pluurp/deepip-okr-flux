
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Department from "./pages/Department";
import Objective from "./pages/Objective";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { OKRProvider } from "./context/OKRContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <OKRProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/departments/:id" element={<Department />} />
            <Route path="/objectives/:id" element={<Objective />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </OKRProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
