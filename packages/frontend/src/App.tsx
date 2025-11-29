import SignIn from '@/components/forms/SignIn';
import SignUp from '@/components/forms/SignUp';
import Auth from '@/layout/Auth';
import Main from '@/layout/Main';
import About from '@/pages/About';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<Main />}>
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
