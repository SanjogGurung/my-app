import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm.js'
import VerificationPage from './pages/VerificationPage.js'
import LoginPage from './pages/LoginPage.js';
import HomePage from './pages/HomePage.js';
import Dashboard from './pages/staff/Dashboard.js';



function App() {
  return (
    <BrowserRouter>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/verify-email" element={<VerificationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/staff" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
  );
}

export default App;
