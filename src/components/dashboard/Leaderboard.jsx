import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { supabase } from '../../lib/supabase'; // Adjust path if needed

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('typing_results')
          .select('user_email, wpm, accuracy')
          .order('wpm', { ascending: false })
          .order('accuracy', { ascending: false }) // Secondary sort for ties
          .limit(10); // Fetch top 10 scores

        if (error) throw error;

        // Process data: assign ranks and extract display names
        const processedScores = data.map((score, index) => ({
          rank: index + 1,
          // Extract name from email (e.g., username part)
          name: score.user_email.split('@')[0] || 'Anonymous',
          wpm: score.wpm,
          accuracy: score.accuracy,
          id: `${score.user_email}-${score.wpm}-${index}` // Simple unique key
        }));

        setScores(processedScores);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // Empty dependency array means run once on mount

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>Leaderboard</h1>
        <p>Top Performers</p>
      </div>

      <div className="leaderboard-content glass">
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="rank-col">Rank</div>
            <div className="name-col">Name</div>
            <div className="score-col">WPM</div>
            <div className="accuracy-col">Accuracy</div>
          </div>
          {loading && <div className="loading-message">Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && scores.length === 0 && (
            <div className="empty-message">No scores yet!</div>
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

export default Leaderboard;
