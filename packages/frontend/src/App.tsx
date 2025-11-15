import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import About from "@/pages/About";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Layout from "@/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/inbox" element={<div>Inbox Page</div>} />
          <Route path="/calendar" element={<div>Calendar Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}