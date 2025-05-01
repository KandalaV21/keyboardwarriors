import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import './PublicLeaderboard.css';
import { supabase } from '../../lib/supabase';

const PublicLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get total attempts count
        const { count: totalCount, error: countError } = await supabase
          .from('typing_results')
          .select('*', { count: 'exact' });

        if (countError) throw countError;

        // Get unique users count
        const { data: emails, error: emailsError } = await supabase
          .from('typing_results')
          .select('user_email');

        if (emailsError) throw emailsError;

        const uniqueEmails = new Set(emails.map(result => result.user_email));

        // Get top 10 scores
        const { data: topScores, error: scoresError } = await supabase
          .from('typing_results')
          .select('user_email, wpm, accuracy')
          .order('wpm', { ascending: false })
          .limit(10);

        if (scoresError) throw scoresError;

        // Process data: assign ranks and extract names
        const processedScores = topScores.map((score, index) => {
          const name = score.user_email.split('@')[0] || 'Anonymous';

          return {
            rank: index + 1,
            name: name,
            wpm: score.wpm,
            accuracy: score.accuracy,
            id: `${score.user_email}-${score.wpm}-${index}`
          };
        });

        setScores(processedScores);
        setTotalAttempts(totalCount);
        setUniqueUsers(uniqueEmails.size);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="public-leaderboard-page">
      <Header />
      <div className="leaderboard-content glass">
        <div className="leaderboard-title">
          <h2><span>Public </span><span>Leaderboard</span></h2>
          <div className="stats-container">
            <div className="stat-box glass">
              <span className="stat-value">{totalAttempts}</span>
              <span className="stat-label">Total Attempts</span>
            </div>
            <div className="stat-box glass">
              <span className="stat-value">{uniqueUsers}</span>
              <span className="stat-label">Unique Warriors</span>
            </div>
          </div>
        </div>

        <div className="leaderboard-table">
          <div className="table-header">
            <div className="rank-col">Rank</div>
            <div className="name-col">Warrior</div>
            <div className="score-col">WPM</div>
            <div className="accuracy-col">Accuracy</div>
          </div>
          {loading && <div className="loading-message">Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && scores.length === 0 && (
            <div className="empty-message">No warriors have joined the battle yet!</div>
          )}
          {!loading && !error && scores.map((score) => (
            <div key={score.id} className="table-row">
              <div className="rank-col">
                <span className={`rank rank-${score.rank}`}>#{score.rank}</span>
              </div>
              <div className="name-col">{score.name}</div>
              <div className="score-col">{score.wpm}</div>
              <div className="accuracy-col">{score.accuracy}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicLeaderboard;
