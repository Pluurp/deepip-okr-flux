
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OKRProvider } from "./context/OKRContext";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import Company from "./pages/Company";
import Department from "./pages/Department";
import Objective from "./pages/Objective";
import Timeline from "./pages/Timeline";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OKRProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/company" element={<Company />} />
            <Route path="/departments/:departmentId" element={<Department />} />
            <Route path="/objectives/:objectiveId" element={<Objective />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </OKRProvider>
    </QueryClientProvider>
  );
}

export default App;
