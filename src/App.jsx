import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import SpeedTest from './components/dashboard/SpeedTest';
import Profile from './components/dashboard/Profile';
import Leaderboard from './components/dashboard/Leaderboard';
import AboutUs from './components/about/AboutUs';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicLeaderboard from './components/public/PublicLeaderboard';
import './App.css';

if (typeof window !== 'undefined' && window.innerWidth > 768) {
  import('./utils/devtools-detect');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!clerkPubKey) {
    throw new Error('Missing Clerk Publishable Key');
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/leaderboard" element={<PublicLeaderboard />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<SpeedTest />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<AboutUs />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  )
}

export default App
