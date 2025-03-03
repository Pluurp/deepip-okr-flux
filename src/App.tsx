
import { Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import Department from "@/pages/Department";
import Objective from "@/pages/Objective";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Company from "@/pages/Company";

import "./App.css";
import { OKRProvider } from "./context/OKRContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  return (
    <OKRProvider>
      <SonnerToaster richColors position="top-right" />
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/department/:id" element={<Department />} />
        <Route path="/objective/:id" element={<Objective />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/company" element={<Company />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </OKRProvider>
  );
}

export default App;
