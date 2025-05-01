import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, NavLink } from 'react-router-dom';
import './DashboardNav.css';

const DashboardNav = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="dashboard-nav glass">
      <div className="nav-left">
        <div className="user-brief">
          <div className="user-avatar">
            {user?.firstName?.[0] || 'U'}
          </div>
          <span className="user-name">{user?.firstName || 'User'}</span>
        </div>
      </div>
      <div className="nav-links">
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Speed Test
        </NavLink>
        <NavLink to="/dashboard/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Leaderboard
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Profile
        </NavLink>
        <NavLink to="/dashboard/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          About Us
        </NavLink>
      </div>
      <div className="nav-right">
        <button className="sign-out-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default DashboardNav;
