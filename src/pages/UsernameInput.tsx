import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsernameInput = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (username.trim()) {
      localStorage.setItem('currentPlayer', username.trim());
      navigate('/game');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-between py-12">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full max-w-md px-4">
        {/* Title Section */}
        <div className="mt-8">
          <h1 className="text-5xl font-bold text-[#8B6E5E] flex items-center">
            <span className="text-3xl">🌸</span>
            Memory Match
            <span className="text-3xl">🍵</span>
          </h1>

          <p className="text-[#8B6E5E] text-xl text-center mt-2">
            Match cards and test your memory
          </p>
        </div>

        {/* Username Input Section */}
        <div className="w-full mt-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold text-[#8B6E5E]">What's your name?</h2>
            <p className="text-[#8B6E5E] text-xl">Enter a username to appear on the leaderboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-4 rounded-full border border-[#D4A5A5] focus:outline-none focus:ring-2 focus:ring-[#D4A5A5] text-[#8B6E5E]"
            />

            <button
              type="submit"
              className="w-full bg-[#D4A5A5] text-white text-lg font-semibold py-4 px-8 rounded-full hover:bg-[#C89595] transition-colors duration-300"
            >
              Begin Round 1
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-white text-[#8B6E5E] text-lg font-semibold py-4 px-8 rounded-full hover:bg-gray-50 transition-colors duration-300"
            >
              Back
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-[#8B6E5E] text-sm mt-8">
        © 2025 Yuko Shimura. All rights reserved.
      </footer>
    </div>
  );
};

export default UsernameInput; 