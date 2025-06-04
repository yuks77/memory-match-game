import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
  name: string;
  score: number;
}

const Leaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setScores(leaderboard);
  }, []);

  const displayedScores = showAll ? scores : scores.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center text-[#8B6E5E] hover:text-[#D4A5A5] transition-colors text-lg"
          >
            <span className="mr-2">←</span> Back
          </Link>
          <h1 className="text-2xl font-bold text-[#8B6E5E]">
            Top Players
          </h1>
          <div className="w-16"></div> {/* Spacer for alignment */}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3 mb-6">
          {displayedScores.map((entry, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#8B6E5E] font-medium">
                  {index + 1}
                </div>
                <div className="ml-4 text-[#8B6E5E]">{entry.name}</div>
              </div>
              <div className="text-[#8B6E5E] font-medium">{entry.score}</div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {scores.length > 5 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full bg-white text-[#8B6E5E] py-3 px-6 rounded-full hover:bg-gray-50 transition-colors mb-6"
          >
            Show More
          </button>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <Link
            to="/start"
            className="block w-full bg-[#D4A5A5] text-white text-lg font-semibold py-4 px-8 rounded-full hover:bg-[#C89595] transition-colors duration-300 text-center"
          >
            Play Again
          </Link>
          <Link
            to="/"
            className="block w-full bg-white text-[#8B6E5E] text-lg font-semibold py-4 px-8 rounded-full hover:bg-gray-50 transition-colors duration-300 text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 