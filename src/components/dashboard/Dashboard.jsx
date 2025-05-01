import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <DashboardNav />
      <Outlet />
    </div>
  );
};

export default Dashboard;
