import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../lib/supabase';
import './Profile.css';

const Profile = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    testsCompleted: 0,
    bestWpm: 0,
    averageWpm: 0,
    bestAccuracy: 0,
    averageAccuracy: 0,
    totalWordsTyped: 0,
    testHistory: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const userEmail = user.emailAddresses[0].emailAddress;
        
        // Get all test results for the user
        const { data, error } = await supabase
          .from('typing_results')
          .select('*')
          .eq('user_email', userEmail)
          .order('timestamp', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Calculate statistics
          const testsCompleted = data.length;
          const bestWpm = Math.max(...data.map(test => test.wpm));
          const bestAccuracy = Math.max(...data.map(test => test.accuracy));
          const averageWpm = Math.round(
            data.reduce((sum, test) => sum + test.wpm, 0) / testsCompleted
          );
          const averageAccuracy = Math.round(
            data.reduce((sum, test) => sum + test.accuracy, 0) / testsCompleted
          );
          const totalWordsTyped = data.reduce(
            (sum, test) => sum + test.total_words, 0
          );

          setStats({
            testsCompleted,
            bestWpm,
            averageWpm,
            bestAccuracy,
            averageAccuracy,
            totalWordsTyped,
            testHistory: data
          });
        }
      } catch (error) {
        console.error('Error fetching typing stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  const getDisplayName = () => {
    if (!user) return 'User'; 
    const name = user.firstName || user.fullName;
    if (name) return name;
    
    const email = user.primaryEmailAddress?.emailAddress;
    if (email) return email.split('@')[0];
    
    return 'Anonymous'; 
  };

  const displayName = getDisplayName();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header glass">
        <div className="profile-avatar">
          {user?.firstName?.[0] || 'U'}
        </div>
        <h1>Welcome, {displayName}!</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-card glass">
          <h2>Account Information</h2>
          <div className="profile-info-grid">
            <div className="info-item">
              <label>Email</label>
              <span>{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <span>{new Date(user?.createdAt || '').toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Username</label>
              <span>{user?.username || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="profile-card glass">
          <h2>Typing Performance</h2>
          <div className="profile-stats-grid">
            <div className="stat-item">
              <label>Tests Completed</label>
              <span className="stat-value">{stats.testsCompleted}</span>
            </div>
            <div className="stat-item">
              <label>Total Words Typed</label>
              <span className="stat-value">{stats.totalWordsTyped}</span>
            </div>
          </div>

          <div className="stats-section">
            <h3>Speed</h3>
            <div className="stats-row">
              <div className="stat-item">
                <label>Best WPM</label>
                <span className="stat-value highlight">{stats.bestWpm || '-'}</span>
              </div>
              <div className="stat-item">
                <label>Average WPM</label>
                <span className="stat-value">{stats.averageWpm || '-'}</span>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3>Accuracy</h3>
            <div className="stats-row">
              <div className="stat-item">
                <label>Best Accuracy</label>
                <span className="stat-value highlight">{stats.bestAccuracy}%</span>
              </div>
              <div className="stat-item">
                <label>Average Accuracy</label>
                <span className="stat-value">{stats.averageAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card glass">
          <h2>Test History</h2>
          <div className="test-history-list">
            {stats.testHistory.map((test, index) => (
              <div key={index} className="test-item glass">
                <div className="test-stat">
                  <label>WPM</label>
                  <span className={test.wpm === stats.bestWpm ? 'highlight' : ''}>
                    {test.wpm}
                  </span>
                </div>
                <div className="test-stat">
                  <label>Accuracy</label>
                  <span className={test.accuracy === stats.bestAccuracy ? 'highlight' : ''}>
                    {test.accuracy}%
                  </span>
                </div>
                <div className="test-stat">
                  <label>Words</label>
                  <span>{test.total_words}</span>
                </div>
                <div className="test-date">
                  {new Date(test.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
